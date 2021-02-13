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
    
    await loginToFacebook(page)
    console.log("finishing loging in")

    // click the create file
    await page.click("button")

    // refresh every 5 minute until "[role=heading]" is no more 
    // then Pending becomes download
    // facebook does not refreshes the page after the content is ready so you have to do it.
    const copyingDataNotice = await page.$("[role=heading]")
    while(copyingDataNotice){
        await page.reload( {timeout: 300000});
    }
    debug(page)
    console.log("finish waiting for data0")

    // go to available copies to download the data
    const avaliableCopiesTab = "li:last-child" 
    await page.click(avaliableCopiesTab)
    console.log("go to available copies")
    
    
    //download data and wait for it
    const downloadButton = "button[type=submit]"
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click(downloadButton),
    ]);

    console.log("click download button")
    debug(page)


    // if ask then re-enter your password
    const passwordField = page.$("input[type=password]")
    if(passwordField){
        
        console.log("renter password")
        debug(page)

        // element = document.querySelector("input[type=password]")
        await page.type("input[type=password]", process.env.PASS)

        // submit password
        // document.querySelector("td button[type=submit]")
        await page.click("td button[type=submit]")

        //wait for data
        page.waitForNavigation({ waitUntil: "networkidle0" })

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

    // go to the iframe it self
    // now iframe content can be access normally. 
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings&cquick=jsc_c_i&cquick_token=AQ4BCb8-akQALIDVKAA&ctarget=https%3A%2F%2Fwww.facebook.com")
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