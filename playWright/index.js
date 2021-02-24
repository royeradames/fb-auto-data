const downloadFile = require("./scripts/downloadFile")
const login = require("./scripts/login")
index()

async function index() {
  /* start browser */
  const browser = await chromium.launch({ 
    args: ["--start-maximized", "--disable-notifications",  '--disable-extensions', '--mute-audio'],
    defaultViewport: null,
    downloadsPath: "D:\\Lambda\\projects\\puppeteer_test\\data",
  });
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: null,
  })
  const page = await context.newPage()

  /* save credentials enter by user*/
  await login()
  
  /* ask for files*/

  /* Wait for files*/

  /* Download files*/
  // await downloadFile()
}