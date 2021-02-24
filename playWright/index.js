
const login = require("./scripts/login")
index()
const goToDownloadYourInformation = require("./scripts/goToDownloadYourInformation")
const askForFile = require("./scripts/askForFiles")
const waitForFile = require("./scripts/waitForFile")
const downloadFile = require("./scripts/downloadFile")

async function index() {
  /* save credentials enter by user*/
  await login()

  /* start headless browser with credentials*/
  const [browser, page, dataDoc] = await goToDownloadYourInformation()

  /* ask for files*/
  await askForFile(page, dataDoc)
  
  /* Wait for files*/
  await waitForFile(page, dataDoc)

  /* Download files*/
  await downloadFile(page, dataDoc)

  /* Close Automation */
  await browser.close()

}