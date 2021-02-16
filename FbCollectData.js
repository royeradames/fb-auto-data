require("dotenv").config()
const puppeteer = require("puppeteer");
// const fs = require("fs");

(async () => {
    //todo: set downlaod to project folder
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized"]
    });
    const page = await browser.newPage();
    
    // login to facebook
    await loginToFacebook(page)
    console.log("finishing loging in")

    // select doc frame
    // must be donoe this way so download button works.
    // const doc = page.mainFrame().childFrames()[0]

    let elementHandle = await page.$('iframe');
    let doc = await elementHandle.contentFrame();

    // click the create file
    await Promise.all([
        doc.waitForSelector("[role=heading]"),
        doc.click("button"),
    ]);

})();

async function loginToFacebook(page){
    // set download location to local project path
    await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: "./downloads",
    });

    // go to login
    await page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings");
    await page.type("#email", process.env.ID)
    await page.type("#pass",  process.env.PASS)
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click("button[type=submit]"),
    ]);

}
async function facebookLoginCases() {
    // what happens when the user init get files before login in on our portal?
    // cancel that download, then go back and start from the beginning 
    
    if(selector === "#recovery_code_entry"){
        await page.type("#recovery_code_entry", "445364")
        await page.click("button[type=submit]")
    }
    if(selector === "label[for=password_new]"){
        await page.click("#skip_button")
    }
    if (selector === "#error_box"){
        const errorMessage = document.selectAll("#error_box").div.innerHTML
        console.log(errorMessage)
        console.log("Fix error and try again")
        await browser.close();
    }
    await Promise.all([
      page.waitForSelector("#approvals_code"),
      page.click("button[type=submit]")
    
    ]) 
    console.log(await page.content());
    await page.screenshot({path: "screenshot.png"});
    console.log("It ran")
}

async function debug(page){
    await page.evaluate(() => {
        // add chrome debugger stopping point when chrome inpector is open 
        debugger
    })
}