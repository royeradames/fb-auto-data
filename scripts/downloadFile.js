const puppeteer = require("puppeteer");
const loginToFacebook = require("./loginToFacebook")
const waitForFileDownload = require("./downloadFile scripts/waitForFileDownload")

const downloadFile = async (loginUrl) =>  {
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
    await startFileDownload(doc)

    /* wait for file to finish- custom waiter */
    await waitForFileDownload(downloadBrowser, doc)

    // close browser
    console.log("Closing browser")
    await downloadBrowser.close();
    
}

 module.exports = downloadFile