chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.create({
        url: chrome.runtime.getURL("pages/welcome.html")
    })
});

console.log("Runtime working");


chrome.runtime.onMessage.addListener((message) => {

    console.log("Inside add listner");
    
  if (message.action === "inject") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            // files: ["/content/content.js"]
        })
    })

}})

console.log("Ending");
