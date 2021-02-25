
const storeCredentials = require("./scripts/storeCredentials")
const goToDownloadYourInformation = require("./scripts/goToDownloadYourInformation")
const askForFile = require("./scripts/askForFiles")
const waitForFile = require("./scripts/waitForFile")
const downloadFile = require("./scripts/downloadFile")

index()
async function index() {
  /* save credentials enter by user*/
  await storeCredentials()

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