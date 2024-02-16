const fs = require('fs');
const XLSX = require('xlsx');

// Read the XLSX file
const workbook = XLSX.readFile('./cypress/fixtures/updateLeads.xlsx'); // Replace with your actual file path

// Get the desired worksheet name or index
const sheetName = 'Data'; // Replace with the sheet name or index (number)

// Read the worksheet data
const worksheet = workbook.Sheets[sheetName];
const worksheetData = XLSX.utils.sheet_to_json(worksheet);

// Transform the data into the desired format: each row as an array within an array
const transformedData = worksheetData.map(row => Object.values(row));

// Convert the transformed data to a JSON string
const jsonString = JSON.stringify(transformedData);

// Write the JSON string to a TXT file
fs.writeFile('./cypress/fixtures/transformed_data.txt', jsonString, 'utf8', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('TXT file created successfully!');
});