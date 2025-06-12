document.getElementById('reviewButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    });
  });

  // Wait a few seconds and then request the analysis result
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: 'getLatestAnalysis' }, (response) => {
      if (response?.data) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<h2>Security Review Results</h2><pre>' +
          JSON.stringify(response.data, null, 2) + '</pre>';
      } else {
        document.getElementById('results').innerText = 'No analysis result available.';
      }
    });
  }, 30000); // Adjust delay based on backend response time
});
