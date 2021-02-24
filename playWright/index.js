const { chromium } = require('playwright');

const login = require("./scripts/login")
index()
const askForFiles = require("./scripts/askForFiles")
const downloadFile = require("./scripts/downloadFile")

async function index() {
  /* save credentials enter by user*/
  await login()

  /* start headless browser with credentials*/
  const browser = await chromium.launch({ 
        args: ["--start-maximized", "--disable-notifications",  '--disable-extensions', '--mute-audio'],
        defaultViewport: null,
        // devtools: true,
        downloadsPath: "D:\\Lambda\\projects\\puppeteer_test\\data",
    });
  // Create a new incognito browser context with user credentials
  const context = await browser.newContext({
        acceptDownloads: true,
        viewport: null,
        storageState: JSON.parse(process.env.STORAGE),
    })
  // Create a new page in a pristine context. 
  const page = await context.newPage()
  await page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings");
  /* ask for files*/
  await askForFiles(page)
  
  /* Wait for files*/

  /* Download files*/
  // await downloadFile()
}