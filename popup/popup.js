// Handle no monitors created state with UI message
function handleNoMonitorRendering(){
    const monitors = JSON.parse(localStorage.getItem("monitors"))
    const noMonitorContainer = document.querySelector(".state-container")

    if(localStorage.length == 0){
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
handleNoMonitorRendering()

// Hide or show the new monitor form based on user action
function newMonitorFormVisbiliy(){
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
newMonitorFormVisbiliy()

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

// Handle form releated CURD ops
function handleFormOps(){
    // Handle new form sumbmission
    function storeNewMonitorResponse(){
        const monitorFrom = document.querySelector(".create-monitor-form")
        
        monitorFrom.addEventListener("submit", function(formSumbmission){

            // Update localstorage with new monitor
            formSumbmission.preventDefault()    
            
            const rawFormData = Object.fromEntries(new FormData(monitorFrom))

            // Logic to detect or assign new UUID  
            let monitorId;
            const popoverMessage = document.querySelector(".message-text")

            if(monitorFrom.dataset.editingId){
                monitorId = monitorFrom.dataset.editingId; // edit mode
                delete monitorFrom.dataset.editingId;
                popoverMessage.innerHTML = "Monitor updated successfully" // Handle message based on mode
            }

            else {
                monitorId = crypto.randomUUID(); // create mode
                popoverMessage.innerHTML = "Monitor created successfully" // Handle message based on mode
            }

            rawFormData.id = monitorId;
            
            //Popover compontents to handle try and catch in UI
            const popoverPopup = document.querySelector(".message-popup")
            const popoverIcon = document.querySelector(".message-icon")

            // Try adding the final list to the mointors key
            try {

                const finalFormData = {
                    "monitorConfig": rawFormData,
                    "lastCheckInformation": {}
                }

                localStorage.setItem(monitorId, JSON.stringify(finalFormData))
                
                popoverPopup.classList.add("show");
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

    function handleFormEditing(){ //Both edits and deleted
        
        const cardsContainer = document.querySelector(".monitor-cards-rendered-from-js");
        
            cardsContainer.addEventListener("click", function(event) {
                
                const clickedCard = event.target.closest(".monitor-card-parent");
                if (!clickedCard) return;

                const monitorId = clickedCard.dataset.monitorId;

                // Handle form edits
                if (event.target.closest(".edit-action")) {
                    const rawMonitorInfo = JSON.parse(localStorage.getItem(monitorId)).monitorConfig
                    console.log(rawMonitorInfo);

                    const editButtonLable = document.querySelector(".create-monitor-button")
                    editButtonLable.textContent = "Update Monitor"
                    
                    // Elements to update and show the data from storage
                    // Update name in form
                    const monitorName = document.querySelector("#monitor-name");
                    monitorName.value = rawMonitorInfo["monitor-name"];
                    // Update alert type
                    const alertType =  document.querySelector("#alert-type");
                    alertType.value = rawMonitorInfo["alert-type"];
                    // Update endpoint-url
                    const endpointURL = document.querySelector("#monitor-url");
                    endpointURL.value = rawMonitorInfo["monitor-url"];
                    // Update required keyword
                    const requiredKeyword = document.querySelector("#required-keyword");
                    requiredKeyword.value = rawMonitorInfo["required-keyword"];
                    // Update interval
                    const interval = document.querySelector("#check-interval");
                    interval.value = rawMonitorInfo["check-interval"];


                    //Update the form with a monitorID inorder to identify ID later in form submission
                    const form = document.querySelector(".create-monitor-form");
                    form.dataset.editingId = monitorId;

                    // Remove the data monitorID attribute after form is closed
                    const closeFormButton = document.querySelector(".close-button")
                    closeFormButton.addEventListener("click", function(){
                        delete form.dataset.editingId;
                    });

                    const editForm = document.querySelector(".create-monitor-popup")
                    editForm.style.display = "flex"
                    editForm.classList.add("active");
                }

                // Handle monitor deletion
                else if (event.target.closest(".delete-action")) {
                    clickedCard.remove()
                    localStorage.removeItem(monitorId)
                }
                        
                })
    }

    storeNewMonitorResponse();
    handleFormEditing();

}

handleFormOps()

function displayMonitors(){
    const template = document.querySelector("#monitor-card-template");
    const monitorCardParent = document.querySelector(".monitor-cards-rendered-from-js")
    monitorCardParent.innerHTML = null

    // Loop for cloning and shwoing the cards with content from the localstorage

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const monitorValue = JSON.parse(localStorage.getItem(key))
        const monitor = monitorValue.monitorConfig
    

        // Create DOM and card for UI from template fragment
        const templateClone = template.content.cloneNode(true);
        const monitoringCardParent = templateClone.querySelector(".monitor-card-parent");
        monitoringCardParent.dataset.monitorId = monitorValue.monitorConfig.id;

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

        //Logic to covert minutes and hours in check inteval
        const covertedInterval = {
            "2" : "2 Mins.",
            "5": "5 Mins.",
            "10": "10 Mins.",
            "60": "60 Mins.",
            "360": "6 Hrs.",
            "720": "12 Hrs."   
        }
        const storedInterval = monitor["check-interval"] 
        checkInterval.innerText = covertedInterval[storedInterval]  

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
        if (requiredKeywordValue && requiredKeywordValue.trim() !== ""){
            requiredKeyword.textContent = requiredKeywordValue
        }  
        else{
            requiredKeyword.textContent = "Not applicable"
        }

        // Finally attach     
        const newMonitoringCard = monitorCardParent.appendChild(templateClone)
    };

}

displayMonitors()

// Practice 
document.getElementById("injectBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { 
        action: "inject"
    }
);
});