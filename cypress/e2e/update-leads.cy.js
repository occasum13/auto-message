/// <reference types="cypress" />
require('dotenv').config()

describe('update leads', () => {

  const baseUrl = Cypress.config('baseUrl')
  const email = Cypress.config('email')
  const password = Cypress.config('password')

  context('update leads', () => {

    it('process', () => {
      // Visits the website and login
      cy.visit(baseUrl);
      cy.get('#email').type(email);
      cy.get('#senha').type(password);
      cy.get('.cv-btn-block.-primario.-big.-full.m-t-10.--btn-acessar').contains('Acessar').click()

      // Iterates through the .txt to find leadNumbers registered and updates the leads
      cy.fixture('transformed_data.txt').then(allResults => {
        let arrayData = JSON.parse(allResults)
        console.log(arrayData)
        
        cy.get(arrayData).each((innerArray) => {
          const leadNumber = innerArray[2] || '';
          const message = innerArray[9] || ''; 

          if (Number(leadNumber) !== NaN) {
            cy.wait(3000)
            cy.visit(`${baseUrl}/comercial/leads/${leadNumber}/administrar?lido=true`);
            cy.wait(10000)
            cy.get('#goSituacao > div > div.box-acoes > div.listaAcoes > ul > li:nth-child(1) > a > i').should('be.visible').click();
            cy.get('#form_interacao_descricao').type(message);
            cy.get('#salvarAnotacao').click()
          }
        });
      });
    })
  })
})
