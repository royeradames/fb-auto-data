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
    let intervalID
    page.on('download', async download => {
        intervalID = await setInterval( () => { console.log(`File is still downloading. Time ${Date().split(" ")[4]}`)}, 30000)        
        download.saveAs(`./data/${ download.suggestedFilename()}`).then(() => {
            clearInterval(intervalID)
        })
        console.log(download.suggestedFilename())
        download.delete()
        download.createReadStream().then(console.log)
    });

    
//   await browser.close();
})();

