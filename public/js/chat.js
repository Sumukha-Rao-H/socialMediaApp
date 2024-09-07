document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value;
        const currentUserId = document.getElementById('currentUserId').value;
        const friendId = document.getElementById('friendId').value;

        if (message.trim()) {
            socket.emit('chat message', {
                content: message,
                sender: currentUserId,
                receiver: friendId
            });
            messageInput.value = '';
        }
    });

    socket.on('chat message', (msg) => {
        const messageClass = msg.sender === document.getElementById('currentUserId').value ? 'sent' : 'received';
        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageClass}`;
        messageElement.innerHTML = `<p>${msg.content}</p><span>${new Date(msg.timestamp).toLocaleTimeString()}</span>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
});
