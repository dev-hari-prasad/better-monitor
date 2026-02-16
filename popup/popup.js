// Handle no monitors created state with UI message
function handleMonitorRendering(){
    const monitors = JSON.parse(localStorage.getItem("monitors"))
    const noMonitorContainer = document.querySelector(".state-container")

    if(!monitors || monitors.length === 0){

         noMonitorContainer.innerHTML = `
            <img src="/assets/svgs/barcode-duotone.svg">
            <h4 class="state-headings">
                No monitors found. <br/> Create a new one.
            </h4>
        `
    }

    else{
        noMonitorContainer.innerHTML = ""
    }
}
handleMonitorRendering()

// Hide or show the new monitor form based on user action
function newMonitorForm(){
    const createNewMonitorForm = document.querySelector(".create-monitor-popup");
    const newMonitorButton = document.querySelector(".new-mointor");
    const closeButton = document.querySelector(".close-button");
    
    newMonitorButton.addEventListener("click", openForm => {
        createNewMonitorForm.style.display = "flex";
        createNewMonitorForm.classList.add("active");
    });

    closeButton.addEventListener("click", closeFrom => {
        createNewMonitorForm.style.display = "none"
    });
}
newMonitorForm()

// Hide or show required keyword input field based on the selected value
function showRequiredKeyword(){
    const requiredKeywordInput = document.querySelector(".required-keyword");
    const alertType = document.querySelector("#alert-type")
    
    alertType.addEventListener("change", showRequiredKeyword => {
        if(showRequiredKeyword.target.value == "keyword-missing"){
            requiredKeywordInput.style.display = "flex"
        }

        else {
            requiredKeywordInput.style.display = "none";
            requiredKeywordInput.required = "false";
            requiredKeywordInput.value = "";
        }
        
    })
}
showRequiredKeyword()

// Store form responses in indexedDB
function storeNewMonitorResponse(){
    const monitorFrom = document.querySelector(".create-monitor-form")
    
    monitorFrom.addEventListener("submit", function(formSumbmission){

        // Update localstorage with new monitor
        formSumbmission.preventDefault()    
        
        const rawFromData = Object.fromEntries(new FormData(monitorFrom))
        const getAllMonitors = JSON.parse(localStorage.getItem("monitors")) || []
        getAllMonitors.push(rawFromData)  
        
        //Popover compontents to handle try and catch in UI
        const popoverMessage = document.querySelector(".message-text")
        const popoverPopup = document.querySelector(".message-popup")
        const popoverIcon = document.querySelector(".message-icon")

        // Try adding the final list to the mointors key
        try {
            const finalMonitorsList = JSON.stringify(getAllMonitors)
            const finallyAllMonitors = localStorage.setItem("monitors", finalMonitorsList )

            popoverPopup.classList.add("show");
            popoverMessage.innerHTML = "Monitor created successfully"
            popoverIcon.src = "/assets/svgs/check-circle-duotone.svg"
            popoverPopup.style.display = "flex"

            const noMonitorContainer = document.querySelector(".state-container")
            noMonitorContainer.innerHTML = ""

            displayMonitors()
        } 
        
        catch (error) {
            popoverPopup.classList.add("show");
            popoverMessage.innerHTML = `Failed to create monitor. Error: ${error}`
            popoverIcon.src = "/assets/svgs/x-circle-duotone.svg"
            popoverPopup.style.display = "flex"
        }

        finally{
            //Close the popup
            const createNewMonitorForm = document.querySelector(".create-monitor-popup")
            createNewMonitorForm.style.display = "none"

            // Show a toaster
            setTimeout(() => {
                popoverPopup.style.display = "none";
            }, 3000);
        }
        
    })
    
}
storeNewMonitorResponse()

function displayMonitors(){
    const template = document.querySelector("#monitor-card-template");
    const allMonitors = JSON.parse(localStorage.getItem("monitors")) || [];
    const monitorCardParent = document.querySelector(".monitor-cards-rendered-from-js")
    monitorCardParent.innerHTML = null

    // Loop for cloning and shwoing the cards with content from the localstorage
    for (let i = 0; i < allMonitors.length; i++) {
        const monitor = allMonitors[i];

        // Create DOM and card for UI from template fragment
        const templateClone = template.content.cloneNode(true);
        
        //DOM elements to replace monitring data and info in the cards
        const monitorName = templateClone.querySelector(".monitor-name")
        const indicatorIcon = templateClone.querySelector(".indicator-icon")
        const indicatorLiteral = templateClone.querySelector(".indicator-state")
        const monitringURL = templateClone.querySelector(".endpoint-url")
        const checkInterval = templateClone.querySelector(".check-interval-value")
        const alertType = templateClone.querySelector(".monitor-type-text")
        const requiredKeyword = templateClone.querySelector(".required-keyword-text")
        
        // Replace template content with the data in localStorage
        monitorName.textContent = monitor["monitor-name"]
        monitringURL.textContent = monitor["monitor-url"]
        checkInterval.innerText = monitor["check-interval"]  
        // Logic to convert alert type into human redable text
        const convertAlertType = {
            "url-down": "URL is unreachable",
            "host-no-ping" : "Host does not respond to ping",
            "keyword-missing": "Required keyword not found in response"
        } 
        const storedValue = monitor["alert-type"];
        alertType.textContent = convertAlertType[storedValue];

        // Required keyword detection
        const requiredKeywordValue = monitor["required-keyword"];
        if (requiredKeywordValue !== undefined){
            requiredKeyword.textContent = requiredKeywordValue
        }  
        else{
            requiredKeyword.textContent = "Not applicable"
        }

        // Finally attach     
        monitorCardParent.appendChild(templateClone)
    };

}

displayMonitors()