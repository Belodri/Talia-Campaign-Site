//#region Global
/*----------------------------------------------------------------------------
                Global            
----------------------------------------------------------------------------*/

const debug = false;
const playerData = {};
const settlementData = {};

//#endregion

//#region Page Load & Init
/*----------------------------------------------------------------------------
                Page Load & Init            
----------------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', onPageLoad);

async function onPageLoad() {
    await initPageData();
    adjustLastUpdateDisplay();
}

async function initPageData() {
    let rawData;
    try {
        const response = await fetch("importData.json");

        if (!response.ok) {
            throw new Error('Unable to fetch importData.json');
        }
        rawData = await response.json();

        log("Data loaded", rawData );
    } catch (error) {
        console.error("Error loading and processing data:", error);
    }

    initPlayerData(rawData.playerData);
    initSettlementData(rawData.settlementData);
    adjustIngameDateDisplay(rawData.ingameDate);
    setEffectCount(rawData.settlementData.effects);
    populateNavBar();
    log("Formatted Data", { playerData, settlementData });
}

function adjustLastUpdateDisplay() {
    // Get the element with the UTC timestamp
    const lastUpdatedElement = document.getElementById('last-updated');
    if(!lastUpdatedElement) return;
    const timestamp = lastUpdatedElement.dataset.timestamp;

    // Convert to the user's local timezone
    if (timestamp) {
        const localDate = new Date(timestamp);
        const formattedDate = localDate.toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        lastUpdatedElement.textContent = formattedDate;
    }
}

function adjustIngameDateDisplay(ingameDate) {
    const ele = document.getElementById('ingame-date-display');
    ele.textContent = `${ingameDate}`;
}

function populateNavBar() {
    const rickRollLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const navBar = document.getElementById("navbar");
    let lastButton = null;

    const createNavButton = (label, onClickFn) => {
        const button = document.createElement("button");
        button.textContent = label;
        button.onclick = (event) => {
            if (lastButton) lastButton.classList.remove("selected");
            lastButton = event.target;
            lastButton.classList.add("selected");
            onClickFn();
        };
        navBar.appendChild(button);
    }

    Object.keys(playerData).forEach(name => 
        createNavButton(name, () => showPlayer(name))
    );
    createNavButton("Settlement Overview", showSettlement);
    createNavButton("Government Secrets", () => window.location.href=rickRollLink);
}


//#endregion

//#region Debug
/*----------------------------------------------------------------------------
                Debug            
----------------------------------------------------------------------------*/

function log(...args) {
    if(debug) console.log(...args);
}
//#endregion

//#region Page Interaction
/*----------------------------------------------------------------------------
                Page Interaction            
----------------------------------------------------------------------------*/

function showPlayer(playerName) {
    for(let [sectionId, itemArray] of Object.entries(playerData[playerName])) {
        populateSection(sectionId, itemArray);
    }

    toggleHidden("characterDisplay", false);
    toggleHidden("settlementDisplay", true);
}

function showSettlement() {
    for(let [sectionId, itemArray] of Object.entries(settlementData.sections)) {
        populateSection(sectionId, itemArray);
    }

    toggleHidden("characterDisplay", true);
    toggleHidden("settlementDisplay", false);
}

function populateSection(sectionId, itemArray) {
    const section = document.getElementById(sectionId);
    const contentDiv = section.querySelector('.content');
    contentDiv.innerHTML = '';

    if(itemArray.length) {
        itemArray.forEach(item => {
            const itemCardDiv = createItemCard(item);
            if(!itemCardDiv) return;
            contentDiv.appendChild(itemCardDiv);
        });
        
        toggleHidden(sectionId, false)
    } else {
        toggleHidden(sectionId, true);
    }
}

/**
 * @param {string} elementId 
 * @param {boolean} [force] If set to false, `hidden` will only be removed; if set to true, `hidden` will only be added.
 */
function toggleHidden(elementId, force = undefined) {
    const element = document.getElementById(elementId);
    return element.classList.toggle("hidden", force);
}
//#endregion

//#region Item Cards
/*----------------------------------------------------------------------------
                Item Cards            
----------------------------------------------------------------------------*/

function createItemCard(item) {
    const sectionHandlers = {
        "feature-items": createFeatureItemCard,
        "spell-items": createSpellItemCard,
        "physical-items": createPhysicalItemCard,
        "building-items": createBuildingItemCard,
        "effect-items": createEffectItemCard,
    }

    const handler = sectionHandlers[item.section];
    return handler ? handler(item) : null;
}

/**
 * Creates a base collapsible item card element.
 * 
 * The returned `HTMLDivElement` has the following structure:
 * 
 * ```html
 * <div class="collapsible-item">
 *   <div class="collapsible-header"></div>
 *   <div class="collapsible-content"></div>
 * </div>
 * ```
 * 
 * @returns {HTMLDivElement} The base collapsible item card element.
 */
function _createBaseItemCard() {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('collapsible-item');

    //card header
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('collapsible-header');
    itemDiv.appendChild(headerDiv);

    //card content
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('collapsible-content', 'hidden');
    itemDiv.appendChild(contentDiv);

    itemDiv.addEventListener('click', () => {
        contentDiv.classList.toggle('hidden');
    });

    return itemDiv;
}

/** Mutates itemCard! */
function _createItemHeaderSpans(item, itemCard, propKeys) {
    const headerDiv = itemCard.querySelector('.collapsible-header');

    propKeys.forEach(k => {
        const span = document.createElement('span');
        span.textContent = item[k];
        headerDiv.appendChild(span);
    });
}

/** Mutates itemCard! */
function _setItemDescription(item, itemCard) {
    const contentDiv = itemCard.querySelector('.collapsible-content');

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description-container');
    
    const fixedDesc = item.description 
        ? fixDescriptionEnrichers(item.description)
        : "<p></p>";
    descriptionDiv.innerHTML = fixedDesc;

    contentDiv.appendChild(descriptionDiv);
}

function fixDescriptionEnrichers(htmlString) {
    const staticReplacementPatterns = {
        "format=long": "",
        "@prof": "proficiency bonus",
        "@abilities.str.mod": "Strength modifier",
        "@abilities.dex.mod": "Dexterity modifier",
        "@abilities.con.mod": "Constitution modifier",
        "@abilities.int.mod": "Intelligence modifier",
        "@abilities.wis.mod": "Wisdom modifier",
        "@abilities.cha.mod": "Charisma modifier",
    };

    // Step 1: Replace static patterns inside text nodes only
    let processedHtml = htmlString.replace(/(>[^<]*<)/g, (textNode) => {
        let innerText = textNode.slice(1, -1);  // strip > and < to get inner text

        // Replace static patterns in text
        innerText = innerText.replace(
            new RegExp(Object.keys(staticReplacementPatterns).join("|"), "g"),
            (match) => staticReplacementPatterns[match]
        );

        // Step 2: Replace patterns like "&amp;Reference[someText]{replacement}"
        innerText = innerText.replace(/&amp;Reference\[[^\]]+]\{([^}]+)\}/g, "$1");


        // Step 3: Replace patterns like "&amp;Reference[someText]"
        innerText = innerText.replace(/&amp;Reference\[([^\]]+)]/g, (_, refText) => {
            // Check for '=' and handle accordingly
            const hasEquals = refText.includes("=");
            return hasEquals ? refText.split("=").pop() : refText;
        });

        // Step 4: Replace patterns like "@UUID[someText]{replacement}"
        innerText = innerText.replace(/@UUID\[[^\]]+]\{([^}]+)\}/g, "$1");

        return `>${innerText}<`;  // reconstruct the text node
    });

    // Step 5: Remove all style attributes from tags
    processedHtml = processedHtml.replace(/\s*style="[^"]*"/g, "");

    return processedHtml;
}

function createFeatureItemCard(item) {
    const itemCard = _createBaseItemCard();
    _createItemHeaderSpans(item, itemCard, ["name", "requirements"]);
    _setItemDescription(item, itemCard);

    itemCard.classList.add("feature-item");

    return itemCard;
}

function createSpellItemCard(item) {
    const itemCard = _createBaseItemCard();
    _createItemHeaderSpans(item, itemCard, ["name", "spellLevel", "spellSchool", "spellRange"]);
    _setItemDescription(item, itemCard);

    itemCard.classList.add("spell-item");

    return itemCard;
}

function createPhysicalItemCard(item) {
    const itemCard = _createBaseItemCard();
    itemCard.classList.add("feature-item");

    _createItemHeaderSpans(item, itemCard, ["name", "combinedLabel", "quantity", "attunementLabel"]);
    _setItemDescription(item, itemCard);

    return itemCard;
}

/** Shared logic between building-items and effect-items */
function _createFlavorMechanicsElements(item, itemCard) {
    const contentDiv = itemCard.querySelector('.collapsible-content');

    const flavorTextDiv = document.createElement('div');
    flavorTextDiv.classList.add('description-container');
    flavorTextDiv.innerHTML = `<p>${item.flavorText}</p>`;
    contentDiv.appendChild(flavorTextDiv);

    const mechanicsContainerDiv = document.createElement('div');
    mechanicsContainerDiv.classList.add('mechanics-container');

    const grantsListItems = item.grants.reduce((acc, curr) => acc += `<li>${curr}</li>`, "");
    const grantsHtml = `
    <div class="grants-container">
        <span class="list-title">Grants</span>
        ${grantsListItems ? `<ul>${grantsListItems}</ul>` : ""}
    </div>`;

    let requiresHtml = "";
    if(item.requires?.length) {
        const requiresListItems = item.requires.reduce((acc, currObj) => acc += `<li class="${currObj.classList}">${currObj.displayString}</li>`, "");
        requiresHtml = `
        <div class="requires-container">
            <span class="list-title">Requires</span>
            <ul>${requiresListItems}</ul>
        </div>`;
    }

    mechanicsContainerDiv.innerHTML = grantsHtml + requiresHtml;
    contentDiv.appendChild(mechanicsContainerDiv);
}

/**
 * 
 * @param {object} item 
 * @param {string} item.constructionDateDisplay             empty string if not constructed
 * @param {string} item.effectText                          //can be empty
 * @param {string} item.flavorText                       
 * @param {string[]} item.grants                         
 * @param {boolean} item.isRecent                           //disregard if not constructed
 * @param {string} item.name
 * @param {{classList: string, displayString: string}[]} item.requires      
 * @param {number} item.scale              
 */
function createBuildingItemCard(item) {
    const itemCard = _createBaseItemCard();
    itemCard.classList.add("building-item");

    const headerProps = {
        scale: `(${item.scale})`,
        name: item.name,
        constructionDateDisplay: item.constructionDateDisplay 
            ? `${item.constructionDateDisplay}`
            : "",
    }
    _createItemHeaderSpans(headerProps, itemCard, ["scale", "name", "constructionDateDisplay"]);
    _createFlavorMechanicsElements(item, itemCard);

    return itemCard;
}

function createEffectItemCard(item) {
    const itemCard = _createBaseItemCard();
    itemCard.classList.add("effect-item");

    const headerProps = {
        name: item.name,
        endDisplay: item.isTemporary ? `${item.remainingDays} days` : ""
    };
    
    _createItemHeaderSpans(headerProps, itemCard, ["name", "endDisplay"]);
    _createFlavorMechanicsElements(item, itemCard);

    return itemCard;
}
//#endregion

//#region Players
/*----------------------------------------------------------------------------
                Players            
----------------------------------------------------------------------------*/

function initPlayerData(rawPlayerData) {
    for(const [name, itemArray] of Object.entries(rawPlayerData)) {
        playerData[name] = processPlayerItemData(itemArray);
    }
}

function processPlayerItemData(itemArray) {
    const sections = {
        "feature-items": [],
        "physical-items": [],
        "spell-items": [],
    }

    for(const rawItem of itemArray) {
        const item = { ...rawItem };
        sections[item.section].push( item );
    }

    _sortFeatureItems(sections["feature-items"]);
    _sortPhysicalItems(sections["physical-items"]);
    _sortSpellItems(sections["spell-items"]);

    return sections;
}

/** Sorts itemsArray in place! */
function _sortSpellItems(itemsArray) {
    // Define a helper to get a numerical order value for each spell level
    const spellLevelOrder = (level) => {
        if (level === "Cantrip") return 0;
        const levelMatch = level.match(/^(\d+)(?:st|nd|rd|th) Level$/);
        return levelMatch ? parseInt(levelMatch[1], 10) : Infinity;
    };

    itemsArray.sort((a, b) => {
        // Sort by spell level
        const levelA = spellLevelOrder(a.spellLevel);
        const levelB = spellLevelOrder(b.spellLevel);
        if (levelA !== levelB) return levelA - levelB;

        // Within the same spell level, sort by spell school
        const schoolComparison = a.spellSchool.localeCompare(b.spellSchool);
        if (schoolComparison !== 0) return schoolComparison;

        // Within the same spell school, sort by name
        return a.name.localeCompare(b.name);
    });
}

/** Sorts itemsArray in place! */
function _sortPhysicalItems(itemsArray) {
    itemsArray.sort((a, b) => {
        // Check attunement requirement first
        if (a.attunementLabel && !b.attunementLabel) return -1;
        if (b.attunementLabel && !a.attunementLabel) return 1;

        // If both have the same attunement status, sort by combinedLabel
        const labelComparison = a.combinedLabel.localeCompare(b.combinedLabel);
        if (labelComparison !== 0) return labelComparison;

        // If both have the same combinedLabel, sort by name
        return a.name.localeCompare(b.name);
    });
}

/** Sorts itemsArray in place! */
function _sortFeatureItems(itemsArray) {
    itemsArray.sort((a, b) => {
        const regex = /^(.*?)(\d+)?\s*(\(.*\))?$/; // Matches prefix, number, and optional parenthesis

        const aMatch = a.requirements.match(regex);
        const bMatch = b.requirements.match(regex);

        const aPrefix = aMatch[1].trim();
        const bPrefix = bMatch[1].trim();

        const aNum = aMatch[2] ? parseInt(aMatch[2], 10) : null;
        const bNum = bMatch[2] ? parseInt(bMatch[2], 10) : null;

        if (aPrefix === bPrefix) {
            // Same prefix, compare by number if available
            if (aNum !== null && bNum !== null) {
                return aNum - bNum; // Numerical order
            } else if (aNum !== null) {
                return -1; // a has a number, b does not
            } else if (bNum !== null) {
                return 1; // b has a number, a does not
            }
            // Both lack numbers, sort alphabetically by entire string
            return a.requirements.localeCompare(b.requirements);
        } else {
            // Different prefixes, sort alphabetically by prefix
            return aPrefix.localeCompare(bPrefix);
        }
    });
}
//#endregion

//#region Settlement
/*----------------------------------------------------------------------------
                Settlement            
----------------------------------------------------------------------------*/

async function initSettlementData(rawSettlementData) {
    const sections = {
        "building-items": processBuildingsData(rawSettlementData.buildings),
        "effect-items": processEffectsData(rawSettlementData.effects),
    }

    settlementData.sections = sections;
    settlementData.attributes = rawSettlementData.general.attributes;
    settlementData.capacity = rawSettlementData.general.capacity;
    settlementData.name = rawSettlementData.general.name;

    displayAttributes();
}

function processBuildingsData(buildingsArray) {
    return buildingsArray;
}

function processEffectsData(effectsArray) {
    return effectsArray;
}

function displayAttributes() {
    const attributesData = {
        ...settlementData.attributes,
        capacity: `${settlementData.capacity.available}/${settlementData.capacity.max}`,
    }
    const targetElement = document.getElementById("settlement-attributes");

    for(const [key, value] of Object.entries(attributesData)) {
        const attrDiv = document.createElement("div");
        attrDiv.classList.add("attribute-container");

        const attrHeader = document.createElement("h2");
        attrHeader.textContent = value;
        attrDiv.appendChild(attrHeader);

        const attrSpan = document.createElement("span");
        attrSpan.textContent = key;
        attrDiv.appendChild(attrSpan);

        targetElement.appendChild(attrDiv);
    }
}

function setEffectCount(effects) {
    const effectCount = effects.length;
    
    const buildingH1 = document.querySelector('#effect-items > h1');
    buildingH1.textContent = `Effects (${effectCount})`
}

//#endregion