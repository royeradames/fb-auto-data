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

    /*
        button[disabled=false] does not work reliably on the 1 loadup
        the document it"s loaded by an iframe
        document.querySelector("iframe").contentWindow.document.querySelector("button")

        notes: 
        there are 4 child frames total
        the 1 frame is my target frame. The other 3 frames are it"s child frame.
        id: 16D2888A7EB28013F9D3559662EDD2EE
        I don"t see the contentDocument on it. console.log(await page.mainFrame().childFrames())
    */
    // click the create file
    await page.click("button")

    // refresh every 5 minute until "[role=heading]" is no more 
    // then Pending becomes download
    // facebook does not refreshes the page after the content is ready so you have to do it.
    const copyingDataNotice = await page.$("[role=heading]")
    while(copyingDataNotice){
        await page.reload( {timeout: 300000});
    }
    
    // go to available copies to download the data
    const avaliableCopiesTab = "li:last-child" 
    await page.click(avaliableCopiesTab)
    console.log("go to available copies")
    
    // set download location to local project path
    await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: "./downloads",
    });

    //download data
    const downloadButton = "button[type=submit]"
    await page.click(downloadButton)
    console.log("click download button")
    debug(page)

    //wait for data
    /* 
        could also do a while loop that reloads the page every set amount fo time, until you see the element hide away
    */
    page.waitForNavigation({ waitUntil: "networkidle0" })

    // if ask then re-enter your password
    if(page.$("input[type=password]")){
        
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


    // wait until facebook notifies you that your data is ready.
        /*
            blue notice will leave
            you will get a fb notification
            then page needs to be refresh for Pending text to become a download button

            you have to reload to see the download button
            document.querySelector("button[type=submit]")
            gives you the download button when there is just 1 download option

            Note: deletes buttons are type button so no need to worry about that.

            after hitting the download button
            you need to re-enter you password, and 

            reload when there is a Pending span and download when there is not 
        */

    await browser.close();

})();

async function loginToFacebook(page){
    await page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings");
    // iframe link https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings&cquick=jsc_c_i&cquick_token=AQ4BCb8-akQALIDVKAA&ctarget=https%3A%2F%2Fwww.facebook.com
    // normal link provided by facebook https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings
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