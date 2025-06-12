
// Capture the DOM and send it to the background script
function captureDOM() {
    const domContent = document.documentElement.outerHTML;
    chrome.runtime.sendMessage({ action: 'captureDOM', data: domContent });
    console.log("CONTENT.JS")
    console.log(domContent)
}

captureDOM();
