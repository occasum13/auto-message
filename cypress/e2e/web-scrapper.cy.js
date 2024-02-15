/// <reference types="cypress" />
require('dotenv').config()

describe('scrap data', () => {
  const baseUrl = Cypress.config('baseUrl')
  const email = Cypress.config('email')
  const password = Cypress.config('password')

  context('login and setup', () => {  
    it('access the login page and login', () => {
      cy.on('uncaught:exception', () => {
        return false
      })
      cy.visit(baseUrl);
      cy.get('#email').type(email);
      cy.get('#senha').type(password);
      cy.get('.cv-btn-block.-primario.-big.-full.m-t-10.--btn-acessar').contains('Acessar').click()
      cy.wait(3000)
      cy.visit(`${baseUrl}/comercial/leads`);
      cy.wait(3000)
      cy.get('#botaoBuscaListagem').click();
      cy.get('input[type="checkbox"][name="q[999|idsituacao][]"][value="2"]').click();
      cy.get('button').contains('Buscar').click();
      cy.wait(2000)
      cy.get('#quantidadeSemInteracao').click();

      cy.get('#listagem_informacoes > strong:nth-child(1)').then($el => {
        // Get the text content of the element
        const numberOfContacts = Number($el.text());
        cy.log(`Number of contacts: ${numberOfContacts}`); // Log the value
        cy.get('#qtd').clear(); 
        cy.get('#qtd').type(numberOfContacts)
        cy.get('#formQtd > a').click();
      });

      let updatedAllData = [];

      cy.get('#tabelaListagem > div.table-overflow.table-1000 > table > tbody tr').each((row) => {
          // Get the name element and extract it as before
          const nameElement = row.find('td:nth-child(2) > div > span > b > span');
          const nameText = nameElement.text().trim();

          const words = nameText.split(' ');
          const firstName = words[0];
          const lastName = words.length > 1 ? words[words.length - 1] : '';

          // Get the email element
          const emailElement = row.find('td:nth-child(2) > div > span > div.lighter.abrevia.hidden-text-blur');
          const emailText = emailElement.text().trim();

          // Get the phone number element (assuming it's within the 3rd child div)
          const phoneElement = row.find('td:nth-child(2) > div > span > div:nth-child(3) > span > span.hidden-text-blur.-zap');
          const phoneText = phoneElement.text().trim();
          const contactNumberText = phoneText.slice(1)

          // Get the investment value element (assuming it's within the 4th td)
          const investmentElement = row.find('td:nth-child(4) > div:nth-child(2)');
          const investmentText = investmentElement.text().trim();
          const investmentSplitter = investmentText.split('-')
          const firstInvestment = investmentSplitter[0]

          // Get the lead number element
          const leadNumberElement = row.find('td:nth-child(2) > div > div > span');
          const leadNumberText = leadNumberElement.text().trim();

          const dataArray = [
            'You Paraíso',
            firstInvestment,
            leadNumberText,
            emailText,
            firstName,
            lastName,
            contactNumberText,
            'Moradia',
            '0',
            '="Olá "&E2&", boa tarde! Tudo bem? Sou Renan Ortiz, head de investimentos da Vitacon. Validei que você já investiu conosco no "&B2&", gostaria de te apresentar nossos produtos do Private em que você investe a preço de custo comprando antes do lançamento e consegue uma valorização de 70%, gostaria de receber mais informações?"',
            '=HYPERLINK("https://api.whatsapp.com/send?phone=55"&G2&"&text="&J2&"";"Enviar mensagem")',
            '',
            '',
            '',
            'Cadastro Realizado',
            'WP',
            '',
            '',
            '',
            '',
            '',
            'WP',
            'Proposta enviada',
            'Frio'
          ];
          console.log('Extracted data for row:', dataArray)

          updatedAllData = updatedAllData.concat(dataArray)
      }).then(      
        cy.task('createExcel', { dataArray: updatedAllData, filename: 'combined_data.xlsx' }).then(console.log(updatedAllData)))
    });
  })
})
