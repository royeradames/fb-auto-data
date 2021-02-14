require("dotenv").config()
const puppeteer = require("puppeteer");
// const fs = require("fs");

(async () => {
    //todo: set downlaod to project folder
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized", '--disable-features=site-per-process']
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

    // refresh every 5 minute until "[role=heading]" is no more 
    // then Pending becomes download
    // facebook does not refreshes the page after the content is ready so you have to do it.
    
    // await doc.evaluate(() => {
    //     while(document.querySelector("[role=heading]")){
    //         console.log("going to start waiting for 5 min")
    //         await page.waitForTimeout()//300000
    //         console.log("going to reload")
    //         await page.reload();
    //         console.log("finish reloading")
    //     }
    // })

    // getting error UnhandledPromiseRejectionWarning: Error: Execution context is not available in detached frame. Happens every time page reloads
    while(await doc.$("[role=heading]")){
        console.log("going to start waiting for 5 min")
        await page.waitForTimeout()//300000
        console.log("going to reload")
        await page.reload();
        console.log("finish reloading")
    }
    // while(await doc.$("[role=heading]")){
    //     console.log("going to start waiting for 5 min")
    //     await page.waitForTimeout()//300000
    //     console.log("going to reload")
    //     await page.reload();
    //     console.log("finish reloading")
    // }
    debug(page)
    console.log("finish waiting for data")

    // go to available copies to download the data
    const avaliableCopiesTab = "li:last-child" 
    await doc.click(avaliableCopiesTab)
    console.log("go to available copies")
    
    
    //download data and wait for it
    // todo: fix download button not working. I will need to work it using the nested frame.
    const downloadButton = "button[type=submit]"
    await Promise.all([
        doc.waitForNavigation({ waitUntil: "networkidle0" }),
        doc.click(downloadButton),
    ]);

    console.log("click download button")
    debug(page)


    // if ask then re-enter your password
    const passwordField = doc.$("input[type=password]")
    if(passwordField){
        
        console.log("renter password")
        debug(page)

        // element = document.querySelector("input[type=password]")
        await doc.type("input[type=password]", process.env.PASS)

        // submit password
        // document.querySelector("td button[type=submit]")
        await doc.click("td button[type=submit]")

        //wait for data
        doc.waitForNavigation({ waitUntil: "networkidle0" })

    }

    console.log("Closing browser")
    await browser.close();

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

    // // go to the iframe it self
    // // now iframe content can be access normally. 
    // await Promise.all([
    //     page.waitForNavigation({ waitUntil: "networkidle0" }),
    //     page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings&cquick=jsc_c_i&cquick_token=AQ4BCb8-akQALIDVKAA&ctarget=https%3A%2F%2Fwww.facebook.com")
    // ]);
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