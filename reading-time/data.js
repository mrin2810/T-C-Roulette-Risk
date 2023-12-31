document.addEventListener('DOMContentLoaded', function() {
    // Logic to retrieve and display collected data
    // Example:
    const dataContainer = document.getElementById('dataContainer');
    chrome.storage.sync.get(["data"], function(result) {
        const highlightedData = result["data"];
        if (highlightedData) {
            // Create a table element
            const table = document.createElement('table');
            table.classList.add('history-table');
            const headerRow = document.createElement('tr');
      
            // Create header cells for key and value
            const keyHeader = document.createElement('th');
            const valueHeader = document.createElement('th');
            
            // Set the content of the header cells
            keyHeader.textContent = 'Label';
            valueHeader.textContent = 'Highlights';
            
            // Append header cells to the header row
            headerRow.appendChild(keyHeader);
            headerRow.appendChild(valueHeader);
            
            // Append the header row to the table
            table.appendChild(headerRow);

            // Iterate over the highlightedData object
            for (const key in highlightedData) {
                if (highlightedData.hasOwnProperty(key)) {
                const value = highlightedData[key];

                // Create a table row
                const row = document.createElement('tr');

                // Create table cells for key and value
                const keyCell = document.createElement('td');
                const valueCell = document.createElement('td');

                // Set the content of the cells
                keyCell.textContent = key;
                valueCell.textContent = value;

                // Append cells to the row
                row.appendChild(keyCell);
                row.appendChild(valueCell);

                // Append row to the table
                table.appendChild(row);
                }
            }

            // Append the table to the dataContainer
            dataContainer.appendChild(table);
        } else {
            dataContainer.innerHTML = 'Your collected data goes here';
        }
      });
  });
  