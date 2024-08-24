document.getElementById("addFriendBtn").addEventListener("click", function() {
    document.getElementById("searchContainer").style.display = "block";
});

document.getElementById("requestsBtn").addEventListener("click", function() {
    document.getElementById("requestsPopup").style.display = "block";
});

document.getElementById("closePopup").addEventListener("click", function() {
    document.getElementById("searchContainer").style.display = "none";
    document.getElementById("requestsPopup").style.display = "none";
});
document.getElementById("closePopupBtn").addEventListener("click", function() {
    document.getElementById("requestsPopup").style.display = "none";
});








