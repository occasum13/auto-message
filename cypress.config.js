const { defineConfig } = require("cypress");
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
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
