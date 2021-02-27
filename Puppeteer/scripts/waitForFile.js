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

module.exports = waitForFile