
async function analyzeDOM(domContent) {
    const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dom: domContent })
    });
    return await response.json();
}
