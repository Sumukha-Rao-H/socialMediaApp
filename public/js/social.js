document.getElementById("addFriendBtn").addEventListener("click", function() {
    document.getElementById("searchContainer").style.display = "block";
    document.getElementById("overlay").style.display = "block";
});

document.getElementById("closePopup").addEventListener("click", function() {
    document.getElementById("searchContainer").style.display = "none";
    document.getElementById("overlay").style.display = "none";
});

// Show the requests popup
document.getElementById("requestsBtn").addEventListener("click", async function() {
    try {
        const response = await fetch('/friends/requests', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (data.friendRequests) {
            // Populate the requests popup
            let requestsList = document.querySelector('#requestsPopup .friend-requests-list');
            requestsList.innerHTML = ''; // Clear existing content
            data.friendRequests.forEach(request => {
                let listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${request.username}
                    <form action="/friends/accept-request" method="POST" style="display:inline;">
                        <input type="hidden" name="senderId" value="${request._id}">
                        <button type="submit">Accept</button>
                    </form>
                `;
                requestsList.appendChild(listItem);
            });
        }

        document.getElementById("requestsPopup").style.display = "block";
        document.getElementById("overlay").style.display = "block";
    } catch (error) {
        console.error('Error fetching friend requests:', error);
    }
});

document.getElementById("closeRequestsPopup").addEventListener("click", function() {
    document.getElementById("requestsPopup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
});






