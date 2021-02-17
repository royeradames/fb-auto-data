require("dotenv").config()
const puppeteer = require("puppeteer");
// const fs = require("fs");

(async () => {
    //todo: set downlaod to project folder
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized"]
    });
    
    const page = await browser.newPage();
    const loginUrl = "https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings"
    // login to facebook
    await loginToFacebook(page, loginUrl)

    // //get child frame url 
    // const iframeUrl = page.mainFrame().childFrames()[0].url()
    // // go to the iframe it self
    // // now iframe content can be access normally. 
    // await Promise.all([
    //     page.waitForNavigation({ waitUntil: "networkidle0" }),
    //     page.goto(iframeUrl)
    // ]);

    // //Ask for data
    // await createData(page)

    // //wait for data
    // await waitForData(page)
    

    //close browser
    console.log("Closing 1 browser")
    await browser.close();

    //Download data
    await downloadData(loginUrl)

    console.log("Closing browser")
    await downloadBrowser.close();

})();

async function loginToFacebook(page, loginUrl){
    
    // go to login
    await page.goto(loginUrl);
    await page.type("#email", process.env.ID)
    await page.type("#pass",  process.env.PASS)
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click("button[type=submit]"),
    ]);

    
}
async function createData(page){
    
        
    // click the create file
        await Promise.all([
            page.waitForSelector("[role=heading]"),
            page.click("button"),
        ]);

        //todo:what happens when data is already being created?
        // you can cancel previous and start a new one or click the desable button and act like it's normal.
    }
async function waitForData(page){

    // refresh every 5 minute until "[role=heading]" is no more 
    // then Pending becomes download
    // facebook does not refreshes the page after the content is ready so you have to do it.
    const fiveMinutes = 300000
    while(await page.$("[role=heading]")){
        console.log("going to start waiting for 5 min")
        await page.waitForTimeout(fiveMinutes)
        console.log("going to reload")
        await page.reload();
        console.log("finish reloading")
    }
    
    console.log("finish waiting for data")
    
}
async function downloadData(loginUrl){
    console.log("starting download browser")
    const downloadBrowser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized"]
    });

    const downloadPage = await downloadBrowser.newPage();
    
    //go to main frame
    await loginToFacebook(downloadPage, loginUrl)

    //select child frame
    let elementHandle = await downloadPage.$('iframe');
    let doc = await elementHandle.contentFrame();

    // go to available copies to download the data
    const avaliableCopiesTab = "li:last-child" 
    await doc.click(avaliableCopiesTab)
    console.log("go to available copies")
    
    
    //download data and wait for it
    const downloadButton = "button[type=submit]"
    await Promise.all([
        // todo: why is navigation waiting undefinitely when download fail? 
        downloadPage.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" }),
        doc.click(downloadButton),
    ]);

    console.log("clicked download button")


    // if ask then re-enter your password
    //document.querySelector("iframe").querySelector("input[type=password]")
    const passwordField = await doc.$("input[type=password]")
    console.log("passwordField: ", passwordField)
    if(passwordField){
        
        console.log("renter password")
        debugger

        // element = document.querySelector("input[type=password]")
        await doc.type("input[type=password]", process.env.PASS)

        // submit password
        // document.querySelector("td button[type=submit]")
        await doc.click("td button[type=submit]")

        //wait for data
        downloadPage.waitForNavigation({ waitUntil: "networkidle0" })

    }

    
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