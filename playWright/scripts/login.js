require("dotenv").config()
async function login(page){
    /*Authentication*/

    await page.goto("https://www.facebook.com/dyi/?x=AdkadZSUMBkpk0EF&referrer=yfi_settings");

    // Interact with login form
    await page.fill('#email', process.env.ID);
    await page.fill('#pass', process.env.PASS);
    await page.click('[type=submit]');
    // wait for login
    await page.waitForNavigation({waitUntil: "domcontentloaded"})
}
module.exports = login