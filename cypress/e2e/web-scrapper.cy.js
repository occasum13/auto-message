/// <reference types="cypress" />

require('dotenv').config()
require('cypress-xpath')

describe('scrap data', () => {

  const baseUrl = Cypress.config('baseUrl')
  const email = Cypress.config('email')
  const password = Cypress.config('password')

  // Setting xlsx headers
  let allResults = [[
    'Origem',
    'Campanha',
    'Número do Lead',
    'E-MAIL',
    'NOME',
    'Sobrenome',
    'TELEFONE',
    'Moradia/Invest.',
    'Ticket Médio',
    'Mensagem Padrão',
    'Enviar Primeiro Contato',
    'Corretor',
    'Mensagem',
    'Data 1',
    'Status 1',
    'Cont. 1',
    'Data 2',
    'Cont. 2',
    'Contato 2',
    'Status 2',
    'Data 3',
    'Cont. 3',
    'Status 3',
    'Classificação',
  ],];

  context('login, scrap and save excel file', () => {  

    it('process', () => {

      cy.on('uncaught:exception', () => {
        return false
      })

      // Visits the website and login
      cy.visit(baseUrl);
      cy.get('#email').type(email);
      cy.get('#senha').type(password);
      cy.get('.cv-btn-block.-primario.-big.-full.m-t-10.--btn-acessar').contains('Acessar').click()

      // Go to leads page and setup search
      cy.visit(`${baseUrl}/comercial/leads`);
      cy.get('#botaoBuscaListagem').click();
      // Seletor de filtro aguardando contato correto, liberar as duas abaixo
      cy.get('label.checkbox:nth-child(4) > input:nth-child(1)').click();
      cy.get('button').contains('Buscar').click();
      // Abaixo está o filtro de leads com reserva.
      // cy.get('#filtro-numeros > div:nth-child(3) > div > a').click();
      // cy.get('#quantidadeSemInteracao').click();
      //cy.get('#filtro-numeros > div:nth-child(1) > div > a').click();
      // Acima está o filtro para todos os leads.
      //cy.get('button').contains('Buscar').click();

      cy.get('#listagem_informacoes > strong:nth-child(1)').then($el => {
        // Get the text content of the element
        const numberOfContacts = Number($el.text());
        cy.log(`Number of contacts: ${numberOfContacts}`); // Log the value
        cy.get('#qtd').clear(); 
        cy.get('#qtd').type(numberOfContacts);
        cy.get('#formQtd > a').click();
      });

      cy.get('#tabelaListagem > div.table-overflow.table-1000 > table > tbody tr').each((row) => {
        // Get the name element and extract it as before
        const nameElement = row.find('td:nth-child(2) > div > span > b > span');
        const nameText = nameElement.text().trim();

        // Separetes the first word as firstName and the last word as lastName
        const words = nameText.split(' ');
        const firstName = words[0];
        const lastName = words.length > 1 ? words[words.length - 1] : ''

        // Get the email element
        const emailElement = row.find('td:nth-child(2) > div > span > div.lighter.abrevia.hidden-text-blur');
        const emailText = emailElement.text().trim();

        // Get the phone number element (assuming it's within the 3rd child div)
        const phoneElement = row.find('td:nth-child(2) > div > span > div:nth-child(3) > span > span.hidden-text-blur.-zap');
        const phoneText = phoneElement.text().trim();
        const contactNumberText = phoneText.slice(1);

        // Get the investment value element (assuming it's within the 4th td)
        const investmentElement = row.find('td:nth-child(4) > div:nth-child(2)');
        let investmentText = investmentElement.text().trim();

        // Remove subsequents strings after the first investment by - and , and makes the remaining investment as the first letter uppercase and the rest lowercase
        let investmentSplitter = investmentText.split('-');
        let investmentSplitter2 = investmentSplitter[0].split(',') || []; // Use an empty array if undefined
        let firstInvestment = investmentSplitter2[0] ? investmentSplitter2[0].toLowerCase() : investmentSplitter; // Use an empty string if undefined
        
        firstInvestment = firstInvestment[0].toUpperCase() + firstInvestment.slice(1);

        // Get the lead number element
        const leadNumberElement = row.find('td:nth-child(2) > div > div > span');
        const leadNumberText = leadNumberElement.text().trim();

        // Get time in order to make a personalized greeting depending on hour
        // const timeDate = new Date();
        // const hours = timeDate.getHours();
        // let greetings = "";

        // if (hours > 18 && hours < 24){
        //   greetings = 'boa noite !'
        // } else if (hours < 12 && hours > 1){
        //   greetings = 'bom dia !'
        // } else if (hours > 12 && hours < 18){
        //   greetings = 'boa tarde !'
        // }

        const dataArray = [[ 
            'Base Fria Vitacon',
            firstInvestment,
            leadNumberText,
            emailText,
            firstName,
            lastName,
            contactNumberText,
            '',
            '0',
            'Tentando primeiro contato com o cliente.',
            `=HYPERLINK("https://api.whatsapp.com/send?phone=${contactNumberText}&text="&J2&"";"Enviar mensagem")`,
            '',
            '',
            '',
            '',
            'Cadastro Realizado',
            'WP',
            '',
            '',
            '',
            '',
            'WP',
            '',
            ''
        ],];

        allResults = allResults.concat(dataArray);
        globalThis.allResults = allResults 
        cy.wait(1)
      }).then(() =>{        
        cy.wait(5000)
        console.log(globalThis.allResults)
        cy.writeFile('./cypress/fixtures/extracted_data.txt', JSON.stringify(globalThis.allResults), { encoding: 'utf8' })
      })
    });
  })

  context('update leads', () => {

    it('process', () => {

      cy.on('uncaught:exception', () => {
        return false
      });

      // Visits the website and login
      cy.visit(baseUrl);
      cy.get('#email').type(email);
      cy.get('#senha').type(password);
      cy.get('.cv-btn-block.-primario.-big.-full.m-t-10.--btn-acessar').contains('Acessar').click();

      // Iterates through the .txt to find leadNumbers registered and updates the leads
      cy.fixture('extracted_data.txt').then(allResults => {
        let arrayData = JSON.parse(allResults);
        cy.get(arrayData.slice(2)).each((innerArray) => {
          const leadNumber = innerArray[2] || '';
          const message = innerArray[9] || ''; 
          console.log(leadNumber)
          if (Number(leadNumber) !== NaN) {
            cy.visit(`${baseUrl}/comercial/leads/${leadNumber}/administrar?lido=true`);
            cy.get('#goSituacao > div > div.box-acoes > div.listaAcoes > ul > li:nth-child(1) > a > i').should('be.visible').click();
            cy.get('#form_interacao_descricao').type(message);
            cy.get('#salvarAnotacao').click()
            cy.xpath('//*[@id="4"]').click();
            cy.wait(1000)
          }
        });
      });
    })
  })
})