function displaySearchResults(results) {
    searchResults.innerHTML = ''; // Clear previous results

    // Check if results is empty or undefined
    if (!results || Object.keys(results).length === 0) {
        searchResults.innerHTML = '<p>No results found.</p>';
        return;
    }

    const ul = document.createElement('ul');

    // Iterate over each type of result (enemies, factions, locations, lores, ships)
    for (const type in results) {
        if (results.hasOwnProperty(type)) {
            // Extract the array of results for the current type
            const typeResults = results[type];

            // Check if the typeResults is not empty and is an array
            if (Array.isArray(typeResults) && typeResults.length > 0) {
                // Create a header for the type
                const typeHeader = document.createElement('h3');
                typeHeader.textContent = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize the type
                ul.appendChild(typeHeader);

                // Create a list item for each result
                typeResults.forEach(result => {
                    const li = document.createElement('li');
                    let displayText = '';

                    // Customize display based on the object type
                    switch (type) {
                        case 'enemies':
                            displayText = `Name: ${result.name}, Description: ${result.description}, Health: ${result.health}`;
                            break;
                        case 'factions':
                            displayText = `Name: ${result.name}, Description: ${result.description}, Status: ${result.status}`;
                            break;
                        case 'locations':
                            displayText = `Name: ${result.name}, Description: ${result.description}, Functional: ${result.functional}, Purpose: ${result.purpose}, Population: ${result.population}`;
                            break;
                        case 'lores':
                            displayText = `Description: ${result.description}`;
                            break;
                        case 'ships':
                            displayText = `Name: ${result.name}, Health: ${result.health}, Description: ${result.description}`;
                            break;
                        default:
                            displayText = ''; // No specific display for other types
                            break;
                    }

                    // Add the display text to the list item
                    li.textContent = displayText;
                    ul.appendChild(li);
                });
            }
        }
    }

    searchResults.appendChild(ul);
}
});