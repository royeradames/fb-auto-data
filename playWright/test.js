const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ 
    args: ["--start-maximized", "--disable-notifications",  '--disable-extensions', '--mute-audio'],
    devtools: true, 
    slowMo: 50,
    defaultViewport: null,
    downloadsPath: "D:\\Lambda\\projects\\puppeteer_test\\data",

  });
  const page = await browser.newPage({
    acceptDownloads: true,
    viewport: null,
  });;
  await page.goto("https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4");
//   await page.goto("https://upload.wikimedia.org/wikipedia/commons/3/3d/LARGE_elevation.jpg");

    //custom file loader reports
    // design for downloading 1 complete file at a time 
    let intervalID
    page.on('download', async download => {
        startDownloadReport(download, intervalID)

        // last report
        download.saveAs(`./data/${ download.suggestedFilename()}`).then(() => {
            endDownloadReport(download, intervalID)
        })
    });

    
//   await browser.close();
})();

function endDownloadReport(download, intervalID){
    clearInterval(intervalID)
    console.log(`Time ${Date().split(" ")[4]}: Finished ${download.suggestedFilename()} file download. `)
}

  function startDownloadReport(download, intervalID) {
    // initial file report
        console.log(`Time ${Date().split(" ")[4]}: Starting ${download.suggestedFilename()} file download. `)  
    // continues waiting reports
        intervalID = setInterval( () => { 
            console.log(`Time ${Date().split(" ")[4]}: File is still downloading. `)
        }, 30000) 
  }