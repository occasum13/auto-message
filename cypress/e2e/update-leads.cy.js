/// <reference types="cypress" />
require('dotenv').config()

describe('update leads', () => {

  const baseUrl = Cypress.config('baseUrl')
  const email = Cypress.config('email')
  const password = Cypress.config('password')

  context('update leads', () => {

    it('process', () => {

      cy.on('uncaught:exception', () => {
        return false
      })

      // Visits the website and login
      cy.visit(baseUrl);
      cy.get('#email').type(email);
      cy.get('#senha').type(password);
      cy.get('.cv-btn-block.-primario.-big.-full.m-t-10.--btn-acessar').contains('Acessar').click()

      // Iterates through the .txt to find leadNumbers registered and updates the leads
      cy.fixture('transformed_data.txt').then(allResults => {
        let arrayData = JSON.parse(allResults)
        
        cy.get(arrayData.slice(1)).each((innerArray) => {
          const leadNumber = innerArray[2] || '';
          const message = innerArray[9] || ''; 
          
          if (Number(leadNumber) !== NaN) {
            cy.wait(2000)
            cy.visit(`${baseUrl}/comercial/leads/${leadNumber}/administrar?lido=true`);
            511442
            cy.wait(5000)
            cy.get('.ajust-lista-acoes > li:nth-child(1) > a:nth-child(1) > i:nth-child(1)').should('be.visible').click();
            cy.get('#formularioPrincipalAnatocao > fieldset:nth-child(6) > div:nth-child(1) > div:nth-child(2) > textarea:nth-child(1)').type(message);
            cy.get('#salvarAnotacao').click()
            const situationLeadButton = "#/34"
            cy.get(situationLeadButton).click()
          }
        });
      });
    })
  })
})
