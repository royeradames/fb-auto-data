const puppeteer = require("puppeteer");
const loginToFacebook = require("./loginToFacebook")
const waitForFileDownload = require("./downloadFile scripts/waitForFileDownload")
const startFileDownload = require("./downloadFile scripts/startFileDownload")

const downloadFile = async (loginUrl) =>  {
    console.log("starting download browser")
    const downloadPath = "D:\\Lambda\\projects\\puppeteer_test\\data"
    /* start the browser */
    const downloadBrowser = await puppeteer.launch({
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

    /* wait for file to finish*/
    page.waitForRequest()
    // - custom waiter that depends on the chrome download page
    // await waitForFileDownload(downloadBrowser, doc)
    
    //http request

    // if network failer causes it to fail then redownload it again
    // but I am looking more for if the download speed goes to 0 then redownload a new one and remove it quickly
    // downloadPage.on('requestfinished', request => {
    //     console.log(request.url() + '. File has been donwnloaded.') ;
    // });

    /* close browser */
    console.log("Closing browser")
    await downloadBrowser.close();
    
}

 module.exports = downloadFile