async function waitForFile(doc){
    /* waitForFile */
    // refresh every 5 minute until notice of gathering file is gone 
    // then Pending becomes download
    // facebook does not refreshes the page after the content is ready so you have to do it.
    const frameUrl = await doc.url()
    const fiveMinutes = 300000
    let IsGatheringFile = await doc.$("//div[text()='A copy of your information is being created.']") ? true: false
    while(IsGatheringFile){
        //reload frame
        console.log("going to reload")
        await doc.goto(frameUrl)
        
        // wait for 5 minutes
        console.log(`going to start waiting for 5 min starting in ${Date().split(" ")[4]}`)
        await doc.waitForTimeout(fiveMinutes)
        console.log("finish reloading")

        // check if notice is gone
        IsGatheringFile = await doc.$("//div[text()='A copy of your information is being created.']") ? true: false
    }
    console.log("finish waiting for data")
}

module.exports = waitForFile