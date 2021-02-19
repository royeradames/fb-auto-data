require("dotenv").config()
const puppeteer = require("puppeteer");
// const fs = require("fs");

(async () => {
    const loginUrl = "https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings"
    //todo: set downlaod to project folder
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized"]
    });
    
    const page = await browser.newPage();
    // login to facebook
    await loginToFacebook(page, loginUrl)

    //get child frame url 
    const iframeUrl = page.mainFrame().childFrames()[0].url()
    
    // go to the iframe it self
    // now iframe content can be access normally. 
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.goto(iframeUrl)
    ]);

    //Ask for data
    await createData(page)

    //wait for data
    await waitForData(page)

    //close browser
    console.log("Closing 1 browser")
    await browser.close();

    //Download data
    await downloadData(loginUrl)

    

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
    await page.reload();
    
    console.log("finish waiting for data")
    
}
async function downloadData(loginUrl){
    console.log("starting download browser")
    const downloadPath = "D:\\Lambda\\projects\\puppeteer_test\\data"
    // start the browser
    const downloadBrowser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized", '--disable-extensions', '--mute-audio'],
        env: {
            PUPPETEER_DOWNLOAD_PATH: downloadPath
        }
    });
    
    // create new tab
    const downloadPage = await downloadBrowser.newPage();

    // set download location to local project path
    await downloadPage._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
    });
 
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
    // todo: why is navigation waiting undefinitely when download fail? 
    await doc.click(downloadButton)
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

    }

    //custom wait for file to finish
    await waitForFile()
    async function waitForFile(){
        //new tab
        const settingPage = await downloadBrowser.newPage();
        
        // go to settings
        await settingPage.goto("chrome://downloads/");
        await settingPage.waitForSelector("downloads-manager")
        console.log(`Going to start checking progress bar`)

        // wait for file        
        await settingPage.evaluateHandle( async () => {
            //wait until the progress bar is gone
            let isShowingProgressBar = false
            let timeoutID
            let loop = 1

            console.log(`have check progress bar ${loop} times`)
            console.log(isShowingProgressBar)

            do{
                const waitForHalfMinute = 30000
                // check that the progress bar is there every half a minute
                // await for a Promise that check if the status bar is null on every .5 minutes in a loop 
                // when it does not fine the status bar it will stop the loop
                console.log(`Going to create promise`)

                await new Promise( resolve => { 
                    console.log(`Going to wait for the promise for ${waitForHalfMinute} MS`)
                    
                    timeoutID = setTimeout(() => {
                        console.log("Running the time out")
                        try {
                           // check if progress bar became display none 
                            isShowingProgressBar = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details div:nth-child(4)[style*='display: none']").hidden
                        } catch (error) {
                            //if you cannot find the progress bar being display has none then is being display
                            isShowingProgressBar = true  
                        }
                        console.log("out of the time out the progressbar is ", isShowingProgressBar)
                        
                        resolve()
                    }, waitForHalfMinute)
                })


                console.log("Finish the timeout")
                console.log(isShowingProgressBar)
            }while (isShowingProgressBar)
            clearTimeout(timeoutID)
            console.log("finished clearning out")
        } )
    }

    // close browser
    console.log("Closing browser")
    await downloadBrowser.close();
    
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