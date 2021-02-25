async function createFile(doc){
    /* create file */
    // select the create file button
    const createFileButton = await doc.$("//button//div[text()='Create File']/../..")
    
    // check if it's able or desable
    // aria-disabled is not the same has general disable attribute
    const buttonDissable =(await createFileButton.getAttribute("aria-disabled"))
    const isButtonEnable = buttonDissable === 'false' ? true : false

    // act different if base on the button avalability 
    if(isButtonEnable){
        //button is enable
        await createFileButton.click()
    } else{
        // button is disable
        console.log("files are already being created")
    }
}

module.exports = createFile