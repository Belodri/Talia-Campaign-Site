let formattedData = null;

// Initialize the data loading process on page load
document.addEventListener('DOMContentLoaded', loadAndProcessData);


async function loadAndProcessData() {
    try {
        const response = await fetch('itemData.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Sort and format data (example: by item name alphabetically)
        formattedData = formatAndSortData(data);

        console.log("Data loaded and processed successfully", formattedData);
    } catch (error) {
        console.error("Error loading and processing data:", error);
    }
}

function formatAndSortData(data) {
    const formattedData = {};  // Local variable to hold processed data

    for (let [playerName, itemArray] of Object.entries(data)) {
        const features = [];
        const items = [];
        const spells = [];

        

        // Classify each item in a single pass
        for (let item of itemArray) {
            if (item.itemType === "feat") {
                item.section = "features";
                features.push(item);
            } else if (item.itemType === "spell") {
                item.section = "spells";
                spells.push(item);
            } else {
                item.section = "items";
                item.combinedLabel = item.subtype ? `${item.typeLabel} (${item.subtype})` : item.typeLabel ? item.typeLabel : "Container";
                items.push(item);
            }
        }

        // Initialize categories and sort
        formattedData[playerName] = {
            features: sortFeatures(features),
            items: sortItems(items),
            spells: sortSpells(spells)
        };
    }

    return formattedData;
}

function sortSpells(spells) {
    // Define a helper to get a numerical order value for each spell level
    const spellLevelOrder = (level) => {
        if (level === "Cantrip") return 0;
        const levelMatch = level.match(/^(\d+)(?:st|nd|rd|th) Level$/);
        return levelMatch ? parseInt(levelMatch[1], 10) : Infinity;
    };

    return spells.sort((a, b) => {
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

function sortItems(items) {
    return items.sort((a, b) => {
        // Check attunement requirement first
        if (a.attunement === "required" && b.attunement !== "required") return -1;
        if (b.attunement === "required" && a.attunement !== "required") return 1;

        // If both have the same attunement status, sort by combinedLabel
        const labelComparison = a.combinedLabel.localeCompare(b.combinedLabel);
        if (labelComparison !== 0) return labelComparison;

        // If both have the same combinedLabel, sort by name
        return a.name.localeCompare(b.name);
    });
}

function sortFeatures(features) {
        // Sort the features array with custom logic
    return features.sort((a, b) => {
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

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('active');
}

function loadPlayer(playerName) {
    for(let [sectionName, itemArray] of Object.entries(formattedData[playerName])) {
        populateSection(sectionName, itemArray);
    }
}





function populateSection(sectionId, data) {
    const section = document.getElementById(sectionId);
    const contentDiv = section.querySelector('.content');
    contentDiv.innerHTML = '';

    if (!data || data.length === 0) {
        contentDiv.innerHTML = '<p>No data available</p>';
        return;
    }

    data.forEach(item => {
        const itemDiv = createCollapsibleItem(item);
        contentDiv.appendChild(itemDiv);
    });
}

// Helper function to create a collapsible item
function createCollapsibleItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('collapsible-item');
    
    const header = createCollapsibleHeader(item);
    itemDiv.appendChild(header);
    
    const content = createCollapsibleContent(item.description);
    itemDiv.appendChild(content);

    header.addEventListener('click', () => {
        itemDiv.classList.toggle('active');
    });

    return itemDiv;
}

function getItemProperties(item) {
    if(item.section === "items") {
        return [
            {value: item.name, width: "20%"},
            {value: item.combinedLabel, width: "10%"},
            {value: item.quantity, width: "5%"},
            {value: item.attunement === "required" ? "Requires Attunement" : "", width: "10%"},
        ];
    } else if (item.section === "spells") {
        return [
            {value: item.name, width: "20%"},
            {value: item.spellLevel, width: "10%"},
            {value: item.spellSchool, width: "10%"},
            {value: item.spellRange, width: "10%"},
        ];
    } else {
        return [
            {value: item.name, width: "20%"},
            {value: item.requirements, width: "40%"},
        ];
    }
}

// Helper function to create a collapsible header with non-null properties
function createCollapsibleHeader(item) {
    const header = document.createElement('div');
    header.classList.add('collapsible-header');

    const properties = getItemProperties(item);


    for(let prop of properties) {
        const propDiv = document.createElement("div");
        propDiv.style.width = prop.width;
        propDiv.style.textAlign = "left";
        if(prop.value !== null && prop.value !== undefined) {
            propDiv.textContent = `${prop.value}`;
        }
        header.appendChild(propDiv);
    }
    return header;
}

// Helper function to create a span for a property
function createPropertySpan(value) {
    const span = document.createElement('span');
    span.textContent = `${value}`;
    span.style.marginRight = '10px'; // Optional: add some spacing between properties
    return span;
}

// Helper function to create collapsible content
function createCollapsibleContent(description) {
    const content = document.createElement('div');
    content.classList.add('collapsible-content');
    
    if(description === null && description === undefined) return content;

    // Create a dedicated div for the description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description-container');

    // Inject the HTML string directly (be careful with untrusted HTML input)
    descriptionDiv.innerHTML = fixDescriptionEnrichers(description);
    content.appendChild(descriptionDiv);

    return content;
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