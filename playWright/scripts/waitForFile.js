async function waitForFile(doc){
    /* waitForFile */
    // refresh every 5 minute until "[role=heading]" is no more 
    // then Pending becomes download
    // facebook does not refreshes the page after the content is ready so you have to do it.
    const fiveMinutes = 300000
    while(await doc.$("[role=heading]")){
        console.log(`going to start waiting for 5 min starting in ${Date().split(" ")[4]}`)
        await doc.waitForTimeout(fiveMinutes)
        console.log("going to reload")
        await Promise.All([
            doc.reload(),
            doc.waitForLoadState('domcontentloaded'),
        ])
        console.log("finish reloading")
    }
    await doc.reload();
    
    console.log("finish waiting for data")
}

module.exports = waitForFile