let storedResponses = [];

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "storeResponses") {
    storedResponses = request.data;
    console.log("Responses stored in background script:", storedResponses);
    sendResponse({status: "Responses stored successfully"});
  } else if (request.message === "Hello from content script") {
    console.log("Received message:", request.message);
    sendResponse({reply: "Hello from background script"});
  }
});

// Function to get stored responses
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getStoredResponses") {
    sendResponse({data: storedResponses});
  }
});
