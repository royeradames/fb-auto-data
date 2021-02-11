require('dotenv').config()
const puppeteer = require('puppeteer');
// const fs = require('fs');

(async () => {
    //todo: set downlaod to project folder
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized"]
    });
    const page = await browser.newPage();
    
    await loginToFacebook(page)
    console.log("finishing loging in")
    

    // // save the html page file
    // fs.writeFile('message.html', await page.content(), (err) => {
    //     if (err) throw err;
    //     console.log('The file has been saved!');
    // })

    
    /*
        button[disabled=false] does not work reliably on the 1 loadup
        the document it's loaded by an iframe
        document.querySelector("iframe").contentWindow.document.querySelector("button")

        notes: 
        there are 4 child frames total
        the 1 frame is my target frame. The other 3 frames are it's child frame.
        id: 16D2888A7EB28013F9D3559662EDD2EE
        I don't see the contentDocument on it. console.log(await page.mainFrame().childFrames())
    */
        // select iframe
    await page.evaluate(() => {
        // click the create file
        const createFile =  document.querySelector("iframe").contentDocument.querySelector("button")
        createFile.click()
        debugger
        //wait for download to be finish
        // refresh every 1 minute until Pending becomes download

        
    });

    await page.evaluate(() => {
        //click available copies
        const availableCopies =  document.querySelector("iframe").contentDocument.querySelector("li:last-child")
        availableCopies.click()
        debugger
        
    })
    await page.evaluate(() => {
        //download data
        const downloadButton = document.querySelector("iframe").contentDocument.querySelector("button[type=submit]") 
        downloadButton.click()
        debugger
    })
    await page.evaluate(() => {

        // if ask then re-enter your password
        console.log("re-enter your password button is found yes or no: ", document.querySelector("input[type=password]") )

        if(document.querySelector("input[type=password]")){
            debugger

            // element = document.querySelector("input[type=password]")
            const retypePassword = document.querySelector("input[type=password]")
            retypePassword.type(process.env.PASS)

            // submit password
            // document.querySelector("td button[type=submit]")
            const submitPassword = document.querySelector("td button[type=submit]")
            submitPassword.click()
        }

    })

    // wait until facebook notifies you that your data is ready.
        /*
            blue notice will leave
            you will get a fb notification
            then page needs to be refresh for Pending text to become a download button

            you have to reload to see the download button
            document.querySelector("button[type=submit]")
            gives you the download button when there is just 1 download option

            Note: deletes buttons are type button so no need to worry about that.

            after hitting the download button
            you need to re-enter you password, and 

            reload when there is a Pending span and download when there is not 
        */

    await browser.close();

})();

async function loginToFacebook(page){
    await page.goto('https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings');
    await page.type("#email", process.env.ID)
    await page.type("#pass",  process.env.PASS)
    await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click('button[type=submit]'),

    ]);
}
async function facebookLoginCases() {
    // what happens when the user init get files before login in on our portal?
    // cancel that download, then go back and start from the beginning 
    
    if(selector === "#recovery_code_entry"){
        await page.type("#recovery_code_entry", "445364")
        await page.click("button[type=submit]")
    }
    if(selector === "label[for=password_new]"){
        await page.click("#skip_button")
    }
    if (selector === "#error_box"){
        const errorMessage = document.selectAll("#error_box").div.innerHTML
        console.log(errorMessage)
        console.log("Fix error and try again")
        await browser.close();
    }
    await Promise.all([
      page.waitForSelector("#approvals_code"),
      page.click("button[type=submit]")
    
    ]) 
    console.log(await page.content());
    await page.screenshot({path: 'screenshot.png'});
    console.log("It ran")
}