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
    await page.screenshot({path: "screenshot.png"});
    console.log("It ran")
}