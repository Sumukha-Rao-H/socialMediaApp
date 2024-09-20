function showSection(sectionId) {
    const sections = ["searchContainer", "requestsPopup", "friendsList"];
    sections.forEach(id => {
        document.getElementById(id).style.display = (id === sectionId) ? "block" : "none";
    });
    localStorage.setItem('activeSection', sectionId); // Store the active section
}

function closePopup() {
    showSection('friendsList'); // Default to showing friends list
    localStorage.removeItem('activeSection'); // Clear active section on close
}

document.getElementById("addFriendBtn").addEventListener("click", function() {
    showSection("searchContainer");
});

document.getElementById("requestsBtn").addEventListener("click", function() {
    showSection("requestsPopup");
});

document.getElementById("friendsBtn").addEventListener("click", function() {
    showSection("friendsList");
});

document.getElementById("closePopup").addEventListener("click", closePopup);
document.getElementById("closePopupBtn").addEventListener("click", closePopup);

document.getElementById("groupsBtn").addEventListener('click', function() {
    window.location.href = '/groups';
});

document.addEventListener('DOMContentLoaded', function() {
    const activeSection = localStorage.getItem('activeSection') || 'friendsList'; // Default to friends list
    showSection(activeSection); // Show the last active section on load
});









