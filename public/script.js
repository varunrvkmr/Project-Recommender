document.getElementById('pageForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
    
    const messageInput = document.getElementById('content');
    const chatResponse = document.getElementById('chatResponse');

    // Assuming the role is fixed or determined by some logic on your page
    const role = 'user'; // Example role, adjust as needed

    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: role, content: messageInput.value }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Assuming the server response contains the AI response in a specific format
        chatResponse.value = data.responseText; // This needs to match the server response structure
    })
    .catch(error => console.error('Error:', error));
});
