require('dotenv').config()
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null,
        devtools: true,
        args: ["--disable-notifications", "--start-maximized"]
    });
    const page = await browser.newPage();
    
    console.log("before loging in")
    await loginToFacebook(page)
    console.log("finishing loging in")

    // save the html page file
    fs.writeFile('message.html', await page.content(), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })

    // click the create file
    // button[disabled=false] does not work reliably on the 1 loadup
    await page.click("button[disabled=false]")

    // click available copies
    // document.querySelector("li:last-child")
    await page.click("li:last-child")

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
       

    // re-enter your password
        /*
            element = document.querySelector("input[type=password]")

        */

    // submit password
        // document.querySelector("td button[type=submit]")


    console.log("got data")
    await page.screenshot({path: '/imgs/finish.png'});

    await browser.close();

})();

async function loginToFacebook(page){
    await page.goto('https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings');
    await page.type("#email", "royeraadames@gmail.com")
    await page.type("#pass",  process.env.PASS)
    await page.screenshot({path: '/imgs/login.png'});
    await Promise.all([
        page.waitForSelector("button[disabled=false]"),
        page.click('button[type=submit]'),
    ]);
}
async function facebookLoginCases() {
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