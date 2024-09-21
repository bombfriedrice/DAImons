const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const characterSelect = document.getElementById('character-select');

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const message = chatInput.value.trim();
    const selectedCharacter = characterSelect.value;
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
                characters: characters.map(c => c.getSettings()),
                selectedCharacter: selectedCharacter
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.messages) {
                data.messages.forEach(msg => {
                    addMessage(msg.character, msg.message);
                    const object = scene.getObjectByName(msg.character);
                    if (object) {
                        panCameraToObject(object);
                    }
                });
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

// Populate character select dropdown
characters.forEach(character => {
    const option = document.createElement('option');
    option.value = character.name;
    option.textContent = character.name;
    characterSelect.appendChild(option);
});
