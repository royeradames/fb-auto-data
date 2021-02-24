require("dotenv").config()
const { chromium } = require('playwright');

async function goToDownloadYourInformation(){
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
    
    // go to download your information
    await page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings");
    
    //select child frame
    const frameDocUrl = await (await page.waitForSelector("iframe")).getAttribute("src")
    const doc = await page.frame({url: frameDocUrl})
    await doc.waitForLoadState('domcontentloaded');

    // return the page, and doc
    return [browser, page, doc]
}
module.exports = goToDownloadYourInformation