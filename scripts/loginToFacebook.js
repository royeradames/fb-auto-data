async function loginToFacebook(page, loginUrl){
    
    // go to login
    await page.goto(loginUrl);
    await page.type("#email", process.env.ID)
    await page.type("#pass",  process.env.PASS)
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        page.click("button[type=submit]"),
    ]);

    
}

module.exports = loginToFacebook