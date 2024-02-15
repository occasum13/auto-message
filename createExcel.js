const fs = require('fs');
const XLSX = require('xlsx');

// Read the TXT file
fs.readFile('./cypress/fixtures/extracted_data.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Parse the JSON string into an array of arrays
  const allResults = JSON.parse(data);

  const filteredResults = allResults.slice(0, 1).concat(allResults.slice(2));

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(filteredResults);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Write the workbook to an Excel file
  XLSX.writeFile(workbook, 'extracted_data.xlsx');

  console.log('Excel file created successfully!');
});