This project aims to automate the process of web scrapping data from an website, updating said website, saving the data in a .txt file and converting it into an xlsx/excel file.

How to run:

1. Clone this repository in your local machine
2. Run in your vscode console: npm install
3. Set your .env variables
4. Either run npx cypress open to see it as the browser mod which you can espectate the process or...
5. Run npm run scrapper, which will triger npx cypress run and after it completes, runs node createExcel.js, creating a new xlsx file in the root of your project.

Daily usage - Web Scrapper:

1. Make sure to save the data from extracted_data.xlsx before each run because a new run will clean the .xlsx file
2. Run 'npm run scrapper' to save the data and update the lead
3. Save the content of extracted_data.xlsx
4. Adjust column K with the correct settings to generate the whatsapp link properly and send the messages to respective contacts

Usage of Update Leads after 30 days:

1. Create an xlsx/excel file containing all the information from the leads that need to be updated
2. Put the data inside auto-message/cypress/fixtures and replace updateLeads.xlsx with it, has to have the same name
3. run 'npm run updater'