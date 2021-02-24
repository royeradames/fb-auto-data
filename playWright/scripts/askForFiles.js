async function createFile(page){
    //select child frame
    const frameDocUrl = await (await page.waitForSelector("iframe")).getAttribute("src")
    const doc = await page.frame({url: frameDocUrl})
    await doc.waitForLoadState('domcontentloaded');

    // create file
    await Promise.all([
        page.waitForSelector("[role=heading]"),
        page.click("button"),
    ]);
    
    //todo: what to do if the file has been ask already?
}

modules.exports = createFile