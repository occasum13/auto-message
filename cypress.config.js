const { defineConfig } = require("cypress");
require('dotenv').config()
require('@babel/register');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        createExcel: async (data) => {
          const ExcelJS = require('exceljs');
    
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Sheet1');
          const titleDataArray = [ 'Origem', 'CAMPANHA', 'Número do Lead', 'E-MAIL', 'NOME', 'Sobrenome', 'TELEFONE', 'Moradia/Invest.', 'Ticket Médio', 'Mensagem Padrão', 'Enviar Primeiro Contato', 'Corretor', 'Mensagem', 'Data 1', 'Status 1', 'Cont. 1', 'Data 2', 'Cont. 2', 'Contato 2', 'Status 2', 'Data 3', 'Cont. 3', 'Status 3', 'Classificação']
    
          worksheet.addRow(titleDataArray);
          
          console.log(data.dataArray)

          data.dataArray.forEach(([data]) => {
            console.log([data])
            worksheet.addRow([data]);
          });
          // Write the Excel file using Node.js's file system capabilities
          await workbook.xlsx.writeFile(data.filename);
          return 'Excel file created successfully';
        },
      });
    },
    baseUrl: process.env.BASEURL,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    video: false,
		videoCompression: 0,
		retries: 0,
		screenshotOnRunFailure: false,
		specPattern: 'cypress/e2e/*.{feature,cy.{js,jsx,ts,tsx}}'
  },
});
