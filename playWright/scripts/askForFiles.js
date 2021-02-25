async function createFile(doc){
    /* create file */
    // select the create file button
    const createFileButton = await doc.$("//button//div[text()='Create File']/../..")
    // assert if it's able or desable
    // aria-disabled is not the same has general disable attribute
    const buttonDissable =(await createFileButton.getAttribute("aria-disabled"))
    const isButtonEnable = buttonDissable === 'false' ? true : false
    console.log(isButtonEnable)
    if(isButtonEnable){
        //button is enable
        await createFileButton.click()
    } else{
        // button is disable
        console.log("files are already being created")
    }
    // await Promise.all([
    //     doc.waitForSelector("[role=heading]"),
    //     doc.click("button"),
    // ]);
    
    //todo: what to do if the file has been ask already?
    // you can cancel previous and start a new one or click the desable button and act like it's normal.
}

module.exports = createFile