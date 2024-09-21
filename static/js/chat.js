const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage('You', message);
        chatInput.value = '';

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                characterSettings: daimonCharacter.getSettings(),
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                addMessage('Daimon', data.message);
            } else if (data.error) {
                console.error('Error:', data.error);
                addMessage('System', 'Sorry, there was an error processing your message.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage('System', 'Sorry, there was an error sending your message.');
        });
    }
}

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
