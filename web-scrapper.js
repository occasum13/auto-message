const puppeteer = require('puppeteer');
require('dotenv').config()
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('auto-message-excel');

(async () => {
  const baseUrl = process.env.BASEURL
  const email = process.env.EMAIL
  const password = process.env.PASSWORD
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the login page
  await page.goto(baseUrl);

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // Login
  await page.type('#email', email);
  await page.type('#senha', password);
  await page.click('.cv-btn-block.-primario.-big.-full.m-t-10.--btn-acessar')

  // Navigate to the leads page
  await page.goto(`${baseUrl}/comercial/leads`);

  // Click on the advanced search option
  await page.click('.d-flex.g-10 button')[0] // Get the first button

  // Click on the 'aguardando contato corretor'
  const checkboxXPath = '/html/body/div[8]/div/div/div[2]/div[3]/div/div/div[2]/table/tbody/tr[1]/td[6]/div/label[4]/input';

  const checkbox = await page.$(checkboxXPath);
  
  if (checkbox.length > 0) {
    await checkbox[0].click();
  } else {
    console.warn('Checkbox with specified XPath not found');
  }

  // Click on the 'Buscar' button
  const buscarButtonXPath = '/html/body/div[8]/div/div/div[2]/div[3]/div/div/div[2]/table/tbody/tr[1]/td[7]/button';

  const buscarButton = await page.$(buscarButtonXPath);
  
  if (buscarButton.length > 0) {
    await buscarButton[0].click();
  } else {
    console.warn('Buscar Button with specified XPath not found');
  }

  // Click on the 'Com Reserva' button
  await page.click('//*[@id="quantidadeComReserva"]')

  // Save the number of contacts that exists
  const numberOfContacts = await page.evaluate(() => {
    const element = document.evaluate('/html/body/div[8]/div/div/div[2]/div[1]/div[1]/div/strong[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element.textContent.trim();
  });

  console.log(numberOfContacts)

  // Set the paging to the number of contacts
  await page.type('#qtd', numberOfContacts);
  await page.click('/html/body/div[8]/div/div/div[2]/div[5]/div/div/form/a')

  // Set the excel file headers

  worksheet.addRow(1, [ 'Origem', 'CAMPANHA', 'Número do Lead', 'E-MAIL', 'NOME', 'Sobrenome', 'TELEFONE', 'Moradia/Invest.', 'Ticket Médio', 'Mensagem Padrão', 'Enviar Primeiro Contato', 'Corretor', 'Mensagem', 'Data 1', 'Status 1', 'Cont. 1', 'Data 2', 'Cont. 2', 'Contato 2', 'Status 2', 'Data 3', 'Cont. 3', 'Status 3', 'Classificação']);

  const contacts = [];

  const contactElements = await page.$$('html > body > div:nth-child(8) > div > div > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(2) > table > tbody > tr');
  
  for (const contactElement of contactElements) {
      const fullName = await contactElement.$$eval('td:nth-child(2) > div > span > div:nth-child(2) > span > span:nth-child(2)', span => span.textContent.trim());
      const firstName = fullName.substring(0, fullName.indexOf(' '));
      const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1);
      const contactNumber = await contactElement.$$eval('td:nth-child(2) > div > span > div:nth-child(1)', div => div.textContent.trim());
      const emailAddress = await contactElement.$$eval('td:nth-child(2) > div > span', span => span.getAttribute('data-title').trim());
      const leadNumber = await contactElement.$$eval('td:nth-child(2) > div > div > span', span => span.textContent.trim());
      const investmentType = await contactElement.$$eval('td:nth-child(4) > div:nth-child(2)', div => div.textContent.trim());
  
      contacts.push({ firstName, lastName, contactNumber, emailAddress, leadNumber, investmentType });

      worksheet.addData([
        [
            'You Paraíso',
            investmentType,
            leadNumber,
            emailAddress,
            firstName, 
            lastName,
            contactNumber,
            'Moradia',
            '0',
            `="Olá "&E2&", =SE(HORA(C3)>=18;”Boa Noite !”;SE(HORA(C3)>=12;”Boa Tarde !”;”Bom Dia !”)) Tudo bem? Sou Renan Ortiz, head de investimentos da Vitacon. Validei que você já investiu conosco no "&B2&", gostaria de te apresentar nossos produtos do Private em que você investe a preço de custo comprando antes do lançamento e consegue uma valorização de 70%, gostaria de receber mais informações?"`,
            'Renan Ortiz',
            '',
            '',
            'Cadastro Realizado',
            'WP',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            ''
            ], 
      ]
      );
  }
  
  console.log(contacts);

  await browser.close();
})();