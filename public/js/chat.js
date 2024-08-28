document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to the Socket.IO server

    const chatForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    
    // Get the ID of the current user and friend
    const currentUserId = document.getElementById('currentUserId').value;
    const friendId = document.getElementById('friendId').value;

    if (chatForm && messageInput && chatMessages) {
        // Handle sending messages
        chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const message = messageInput.value;
            socket.emit('chat message', { message, senderId: currentUserId, receiverId: friendId });
            messageInput.value = '';
        });

        // Display incoming messages
        socket.on('chat message', ({ message, senderId }) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message');
            if (senderId === currentUserId) {
                messageElement.classList.add('sent');
            } else {
                messageElement.classList.add('received');
            }
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        });
    } else {
        console.error('One or more required elements are missing');
    }
});


