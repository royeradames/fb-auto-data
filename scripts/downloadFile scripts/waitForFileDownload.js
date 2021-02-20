async function waitForFileDownload(downloadBrowser){
        //new tab
        const settingPage = await downloadBrowser.newPage();
        
        // go to settings
        await settingPage.goto("chrome://downloads/");
        await settingPage.waitForSelector("downloads-manager")
        console.log(`Going to start checking progress bar`)
        

        // wait for file        
        await settingPage.evaluateHandle( async () => {
            //wait until the progress bar is gone
            let isShowingProgressBar = false
            let timeoutID
            let loop = 1

            console.log(`have check progress bar ${loop} times`)
            console.log(isShowingProgressBar)

            do{
                const waitForHalfMinute = 30000
                // check that the progress bar is there every half a minute
                // await for a Promise that check if the status bar is null on every .5 minutes in a loop 
                // when it does not fine the status bar it will stop the loop
                console.log(`Going to create promise`)

                await new Promise( resolve => { 
                    console.log(`Going to wait for the promise for ${waitForHalfMinute} MS at ${Date().split(" ")[4]}`)
                    
                    timeoutID = setTimeout(async () => {
                        console.log("Running the time out")
                        try {
                            // todo: automate network fix
                            /*
                                When the file becomes 0 bs check if the total MB does the equal the current Mb if true then
                                - Redownload a new file. Refactor the download code to be reuse here
                                - wait for the cancel button to appear wait 5 min max for the new file
                                - click cancel button 
                                - click remove from list option. #removen
                            */
                           // check the current download status
                           console.log("checking if there is a network issue")
                            const totalData = Number(document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#description").innerText.split(" ")[6])
                            const currentData = Number(document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#description").innerText.split(" ")[3])
                            const downloadSpeed = Number(document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#description").innerText.split(" ")[0])

                            // is file still downlaoding but there is no download speed?
                            const isNoDownloadSpeed = downloadSpeed === 0 
                            const isStillDownloading = totalData != currentData
                            console.log(totalData)
                            console.log(currentData)
                            console.log(downloadSpeed)
                            console.log(isNoDownloadSpeed)
                            console.log(isStillDownloading)

                            if( isNoDownloadSpeed && isStillDownloading){
                                /* start the network error fix */
                                // Redownload a new file. Refactor the download code to be reuse here
                                console.log("going to redownload a new file")
                                const downloadUrl = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#url")
                                
                                // wait until 5 seconds before redownloading the file
                                const fiveSeconds = 5000
                                await new Promise( resolve => { 
                                    console.log(`Going to wait for the promise for ${waitForHalfMinute} MS at ${Date().split(" ")[4]}`)
                                    
                                    timeoutID = setTimeout(async () => {

                                    downloadUrl.click()
                                    resolve()
                                }, fiveSeconds)})

                                // click cancel button 
                                console.log("going to click cancel button")
                                const cancelButton = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details").querySelector("#safe").querySelectorAll("cr-button")[1]
                                await cancelButton.click()

                                // click remove from list option. #removen
                                console.log("going to click remove option")
                                const removeListOption = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#remove")
                                await removeListOption.click()

                                console.log("finished fixing the network error")
                            }

                           // check if progress bar became display none 
                            isShowingProgressBar = document.querySelector("downloads-manager").shadowRoot.querySelector("#mainContainer").querySelector("#downloadsList").querySelector("downloads-item").shadowRoot.querySelector("#details div:nth-child(4)[style*='display: none']").hidden
                        } catch (error) {
                            //if you cannot find the progress bar being display has none then is being display
                            isShowingProgressBar = true  
                        }
                        console.log("out of the timeout the progressbar is ", isShowingProgressBar)
                        
                        resolve()
                    }, waitForHalfMinute)
                })


                console.log("Finish the timeout")
                console.log(isShowingProgressBar)
                loop++
            }while (isShowingProgressBar) //stop if the progress bar cannot be view
            clearTimeout(timeoutID)
            console.log("finished clearning out")
        } )
    }
module.exports = waitForFileDownload