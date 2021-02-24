async function createFile(page){
    // click the create file
    await Promise.all([
        page.waitForSelector("[role=heading]"),
        page.click("button"),
    ]);

    //todo:what happens when data is already being created?
    // you can cancel previous and start a new one or click the desable button and act like it's normal.
}

module.exports = createFile