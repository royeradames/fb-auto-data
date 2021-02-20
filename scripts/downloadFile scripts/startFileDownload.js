async function startFileDownload(doc){
        
        //download data and wait for it
        const downloadButton = "button[type=submit]"
        await doc.click(downloadButton)
        console.log("clicked download button")

        // if ask then re-enter your password
        //document.querySelector("iframe").querySelector("input[type=password]")
        const passwordField = await doc.$("input[type=password]")
        console.log("passwordField: ", passwordField)
        if(passwordField){
            
            console.log("renter password")

            // element = document.querySelector("input[type=password]")
            await doc.type("input[type=password]", process.env.PASS)

            // submit password
            // document.querySelector("td button[type=submit]")
            await doc.click("td button[type=submit]")

        }
    }
    
module.exports = startFileDownload