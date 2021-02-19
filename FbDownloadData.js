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
    await createFile(page)

    //wait for data
    await waitForFile(page)

    //close browser
    console.log("Closing 1 browser")
    await browser.close();

    // Download data
    await downloadFile(loginUrl)

    

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
async function createFile(page){
    
        
    // click the create file
        await Promise.all([
            page.waitForSelector("[role=heading]"),
            page.click("button"),
        ]);

        //todo:what happens when data is already being created?
        // you can cancel previous and start a new one or click the desable button and act like it's normal.
    }
async function waitForFile(page){

    // refresh every 5 minute until "[role=heading]" is no more 
    // then Pending becomes download
    // facebook does not refreshes the page after the content is ready so you have to do it.
    const fiveMinutes = 300000
    while(await page.$("[role=heading]")){
        console.log(`going to start waiting for 5 min starting in ${Date().split(" ")[4]}`)
        await page.waitForTimeout(fiveMinutes)
        console.log("going to reload")
        await page.reload();
        console.log("finish reloading")
    }
    await page.reload();
    
    console.log("finish waiting for data")
    
}
async function downloadFile(loginUrl){
    console.log("starting download browser")
    const downloadPath = "D:\\Lambda\\projects\\puppeteer_test\\data"
    /* start the browser */
    const downloadBrowser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized", '--disable-extensions', '--mute-audio'],
        env: {
            PUPPETEER_DOWNLOAD_PATH: downloadPath
        }
    });
    
    /* create new tab */
    const downloadPage = await downloadBrowser.newPage();

    // set download location to local project path
    await downloadPage._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
    });
 
    /* login to facebook */
    await loginToFacebook(downloadPage, loginUrl)

    /* Go to download option */
    //select child frame
    let elementHandle = await downloadPage.$('iframe');
    let doc = await elementHandle.contentFrame();

    // go to available copies to download the data
    const avaliableCopiesTab = "li:last-child" 
    await doc.click(avaliableCopiesTab)
    console.log("go to available copies")
    
    /* download file */
    await downloadFile(doc)

    /* wait for file to finish- custom waiter */
    await waitForFile(downloadBrowser, doc)

    // close browser
    console.log("Closing browser")
    await downloadBrowser.close();
    
}
async function downloadFile(doc){
        
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
    }
async function waitForFile(downloadBrowser){
        //new tab
        const settingPage = await downloadBrowser.newPage();
        
        // go to settings
        await settingPage.goto("chrome://downloads/");
        await settingPage.waitForSelector("downloads-manager")
        // todo: open the dev console on the console tab instead of the elements tab
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
                    console.log(`Going to wait for the promise for ${waitForHalfMinute} MS at ${Date().split(" ")[4]}`)
                    
                    timeoutID = setTimeout(async () => {
                        console.log("Running the time out")
                        try {
                            // todo: automate network fix
                            /*
                                When the file becomes 0 bs check if the total MB does the equal the current Mb if true then
                                - Redownload a new file. Refactor the download code to be reuse here
                                - wait for the cancel button to appear wait 5 min max for the new file
                                - click cancel button 
                                - click remove from list option. #removen
                            */
                           // check the current download status
                           console.log("checking if there is a network issue")
                            const totalData = Number(document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#description").innerText.split(" ")[6])
                            const currentData = Number(document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#description").innerText.split(" ")[3])
                            const downloadSpeed = Number(document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#description").innerText.split(" ")[0])

                            // is file still downlaoding but there is no download speed?
                            const isNoDownloadSpeed = downloadSpeed === 0 
                            const isStillDownloading = totalData != currentData
                            console.log(totalData)
                            console.log(currentData)
                            console.log(downloadSpeed)
                            console.log(isNoDownloadSpeed)
                            console.log(isStillDownloading)
                            // debugger
                            if( isNoDownloadSpeed && isStillDownloading){
                                /* start the network error fix */
                                // Redownload a new file. Refactor the download code to be reuse here
                                console.log("going to redownload a new file")
                                // debugger
                                const downloadUrl = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#url")
                                
                                // wait until 5 seconds before redownloading the file
                                const fiveSeconds = 5000
                                await new Promise( resolve => { 
                                    console.log(`Going to wait for the promise for ${waitForHalfMinute} MS at ${Date().split(" ")[4]}`)
                                    
                                    timeoutID = setTimeout(async () => {

                                    downloadUrl.click()
                                    resolve()
                                }, fiveSeconds)})

                                // click cancel button 
                                // debugger
                                console.log("going to click cancel button")
                                const cancelButton = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#safe").querySelectorAll("cr-button")[1]
                                await cancelButton.click()
                                // debugger

                                // click remove from list option. #removen
                                // debugger
                                console.log("going to click remove option")
                                const removeListOption = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#remove")
                                await removeListOption.click()
                                // debugger

                                console.log("finished fixing the network error")
                            }

                           // check if progress bar became display none 
                            isShowingProgressBar = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details div:nth-child(4)[style*='display: none']").hidden
                        } catch (error) {
                            //if you cannot find the progress bar being display has none then is being display
                            debugger
                            isShowingProgressBar = true  
                        }
                        console.log("out of the timeout the progressbar is ", isShowingProgressBar)
                        
                        resolve()
                    }, waitForHalfMinute)
                })


                console.log("Finish the timeout")
                console.log(isShowingProgressBar)
                loop++
            }while (isShowingProgressBar) //stop if the progress bar cannot be view
            clearTimeout(timeoutID)
            console.log("finished clearning out")
        } )
    }