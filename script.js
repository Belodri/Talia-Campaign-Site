function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('active');
}

function loadPlayer(playerName) {
    const filePath = `data/${playerName}.json`; // Update to point to the json folder
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            populateSection('features', data);
            populateSection('items', data);
            populateSection('spells', data);
        })
        .catch(error => console.error('Error loading player data:', error));
}

function processData(data) {
    const sectionIds = ["features", "items", "spells"];

    const contentObject = {
        features: [],
        items: [],
        spells: []
    };

    for(let item of Object.values(data)) {
        contentObject
    }
}



function populateFeatures(contentArray) {
    const sectionId = 'features';
    const section = document.getElementById(sectionId);
    const contentDiv = section.querySelector('.content');
    contentDiv.innerHTML = '';

    if (!contentArray || contentArray.length === 0) {
        contentDiv.innerHTML = '<p>No data available</p>';
        return;
    }

    contentArray.forEach(item => {
        const itemDiv = createCollapsibleItem(item);
        contentDiv.appendChild(itemDiv);
    });
}

function populateSection(sectionId, data) {
    const section = document.getElementById(sectionId);
    const contentDiv = section.querySelector('.content');
    contentDiv.innerHTML = '';

    const filteredData = data.filter(i => i.category === sectionId);
    if (!filteredData || filteredData.length === 0) {
        contentDiv.innerHTML = '<p>No data available</p>';
        return;
    }

    filteredData.forEach(item => {
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

// Helper function to create a collapsible header with non-null properties
function createCollapsibleHeader(item) {
    const header = document.createElement('div');
    header.classList.add('collapsible-header');

    // Add other properties if they're not null
    const properties = [
        {value: item.name, width: '20%'},
        {value: item.quantity, width: "10%"},
        {value: item.requiresAttunement ? "Requires Attunement" : "", width: "15%"},
        {value: item.spellLevelAndSchool, width: "25%"},
        {value: item.spellRange, width: "15%"},
    ];

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
    
    if (description !== null && description !== undefined) {
        const descriptionP = document.createElement('p');
        descriptionP.textContent = description;
        content.appendChild(descriptionP);
    }

    return content;
}