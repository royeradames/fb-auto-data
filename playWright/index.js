require("dotenv").config()

const { chromium } = require('playwright');

(async () => {
  // start browser
  const browser = await chromium.launch({ 
    args: ["--start-maximized", "--disable-notifications",  '--disable-extensions', '--mute-audio'],
    devtools: true, 
    slowMo: 50,
    defaultViewport: null,
    downloadsPath: "D:\\Lambda\\projects\\puppeteer_test\\data",

  });
  const page = await browser.newPage({
    acceptDownloads: true,
    viewport: null,
  });

  /*Authentication*/
  
  await page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings");
  
  // Interact with login form
  await page.fill('#email', process.env.ID);
  await page.fill('#pass', process.env.PASS);
  await page.click('[type=submit]');
  // wait for login
  await page.waitForNavigation({waitUntil: "domcontentloaded"})
 
  /* Go to download option */
  //select child frame
  const frameDocUrl = await (await page.waitForSelector("iframe")).getAttribute("src")
  const doc = await page.frame({url: frameDocUrl})
  // await doc.waitForNavigation({waitUntil: "domcontentloaded"})
  await doc.waitForLoadState('domcontentloaded');
  // go to available copies to download the data
  const avaliableCopiesTab = "li:last-child" 
  // const avaliableCopiesTab = await page.waitForSelector("li:last-child")
  await doc.click(avaliableCopiesTab)

  // click download button
  const downloadButton = "button[type=submit]"
  await doc.click(downloadButton)

  // if ask then re-enter your password
  //document.querySelector("iframe").querySelector("input[type=password]")
  const passwordField = await doc.$("input[type=password]")
  if(passwordField){
      // retype password
      await doc.type("input[type=password]", process.env.PASS)

      // submit password
      await doc.click("td button[type=submit]")

  }

  /* wait for download file */
  //notice when the download starts
  console.log("going to start waiting for file")
  // download file with defaul name and no duplicates 
  page.on('download', download => {
      // save the download file has the suggested file name
      download.saveAs(`./data/${ download.suggestedFilename()}`)
      // delete the criptic file name
      download.delete()
    });
  const download  = await page.waitForEvent('download');
  // Wait for the download process to complete
  // await download.saveAs("Facebook");
  await download.path()

  /* close browser */
  console.log("finished download")
  await browser.close();
  
})();
  // await page.evaluate(() => {debugger})
