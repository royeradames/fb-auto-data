require("dotenv").config()
const puppeteer = require("puppeteer");
const downloadFile = require("./downloadFile")
const loginToFacebook = require("./loginToFacebook")
const waitForFile = require("./waitForFile")
const createFile = require("./createFile")

automateFacebookDataGathering()
async function automateFacebookDataGathering () {
    const loginUrl = "https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings"

    // //todo: set downlaod to project folder
    // const browser = await puppeteer.launch({
    //     headless: false,
    //     defaultViewport: null,
    //     devtools: true,
    //     args: ["--disable-notifications", "--start-maximized"]
    // });
    
    // const page = await browser.newPage();
    // // login to facebook
    // await loginToFacebook(page, loginUrl)

    // //get child frame url 
    // const iframeUrl = page.mainFrame().childFrames()[0].url()
    
    // // go to the iframe it self
    // // now iframe content can be access normally. 
    // await Promise.all([
    //     page.waitForNavigation({ waitUntil: "networkidle0" }),
    //     page.goto(iframeUrl)
    // ]);

    // //Ask for data
    // await createFile(page)

    // //wait for data
    // await waitForFile(page)

    // //close browser
    // console.log("Closing 1 browser")
    // await browser.close();

    // Download data
    await downloadFile(loginUrl)
}