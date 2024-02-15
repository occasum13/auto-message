This project aims to automate the process of web scrapping data from an website, updating said website, saving the data in a .txt file and converting it into an xlsx/excel file.

How to run:

1. Clone this repository in your local machine
2. Run in your vscode console: npm install
3. Set your .env variables
4. Either run npx cypress open to see it as the browser mod which you can espectate the process or...
5. Run npm run scrapper, which will triger npx cypress run and after it completes, runs node createExcel.js, creating a new xlsx file in the root of your project.

I, the creator, am not responsible for the usages of this program, or aims to continue developing this further, as it was only a test experience.