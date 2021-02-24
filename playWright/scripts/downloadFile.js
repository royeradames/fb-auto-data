require("dotenv").config()

async function downloadFile(page) {
  /* Go to download option */
  // go to available copies to download the data
  const avaliableCopiesTab = "li:last-child" 
  // const avaliableCopiesTab = await page.waitForSelector("li:last-child")
  await doc.click(avaliableCopiesTab)

  // click download button
  const downloadButton = "button[type=submit]"
  await doc.click(downloadButton)

  // if ask then re-enter your password
  //document.querySelector("iframe").querySelector("input[type=password]")
  const passwordField = await doc.$("input[type=password]")
  if(passwordField){
      // retype password
      await doc.type("input[type=password]", process.env.PASS)

      // submit password
      await doc.click("td button[type=submit]")
  }

  /* wait for download file */
  //notice when the download starts
  console.log("going to start waiting for file")
  // download file with defaul name and no duplicates
  //custom file loader reports
    // design for downloading 1 complete file at a time 
    let intervalID 
  page.on('download', download => {
    startReportDownloadStatus(intervalID)

    // save the download file has the suggested file name
    // last report
        download.saveAs(`./data/${ download.suggestedFilename()}`).then(() => {
            clearInterval(intervalID)
            console.log(`Time ${Date().split(" ")[4]}: Finished ${download.suggestedFilename()} file download. `)
        })
      // delete the criptic file name
      download.delete()
    });
  const download  = await page.waitForEvent('download');
  // Wait for the download process to complete
  // await download.saveAs("Facebook");
  await download.path()

  /* close browser */
  console.log("finished download")
  
}
  // await page.evaluate(() => {debugger})

function startReportDownloadStatus(intervalID) {
// initial file report
    console.log(`Time ${Date().split(" ")[4]}: Starting ${download.suggestedFilename()} file download. `)  
// continues waiting reports
    intervalID = setInterval( () => { 
        console.log(`Time ${Date().split(" ")[4]}: File is still downloading. `)
    }, 30000) 
}

module.exports = downloadFile