async function createFile(page, doc){
    /* create file */
    await Promise.all([
        doc.waitForSelector("[role=heading]"),
        doc.click("button"),
    ]);
    
    //todo: what to do if the file has been ask already?
    // you can cancel previous and start a new one or click the desable button and act like it's normal.
}

module.exports = createFile