async function goToDownloadYourInformation( context){
    
    // Create a new page in a pristine context. 
    const page = await context.newPage()
    
    // go to download your information
    await page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings");
    
    //select child frame
    const frameDocUrl = await (await page.waitForSelector("iframe")).getAttribute("src")
    const doc = await page.frame({url: frameDocUrl})
    await doc.waitForLoadState('domcontentloaded');

    // return the page, and doc
    return [page, doc]
}

module.exports = goToDownloadYourInformation