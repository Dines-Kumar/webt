document.addEventListener('DOMContentLoaded', () => {
    const messages = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', () => {
        const userText = userInput.value.trim();
        if (userText) {
            addMessage(userText, 'user-message');
            userInput.value = '';
            botResponse(userText);
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    function addMessage(text, className) {
        const message = document.createElement('div');
        message.className = `message ${className}`;
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function botResponse(userText) {
        const responses = {
            'hello': 'Hello! How can I help you today?',
            'how are you': 'I am just a bot, but I am functioning as expected!',
            'bye': 'Goodbye! Have a great day!'
        };
        const botText = responses[userText.toLowerCase()] || "I'm sorry, I don't understand that.";
        setTimeout(() => {
            addMessage(botText, 'bot-message');
        }, 500);
    }
});
