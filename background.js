let latestAnalysis = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureDOM') {
    fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dom: message.data })
    })
    .then(response => response.json())
    .then(data => {
      latestAnalysis = data;
    })
    .catch(error => {
      console.error("Error analyzing DOM:", error);
      latestAnalysis = { error: "Failed to analyze DOM" };
    });
  } else if (message.action === 'getLatestAnalysis') {
    sendResponse({ data: latestAnalysis });
  }

  return true; // Required for async sendResponse
});
