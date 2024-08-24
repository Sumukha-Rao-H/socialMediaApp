document.getElementById("addFriendBtn").addEventListener("click", function() {
    document.getElementById("searchContainer").style.display = "block";
    document.getElementById("requestsPopup").style.display = "none";
    document.getElementById("friendsList").style.display = "none";
});

document.getElementById("requestsBtn").addEventListener("click", function() {
    document.getElementById("requestsPopup").style.display = "block";
    document.getElementById("friendsList").style.display = "none";
    document.getElementById("searchContainer").style.display = "none";
});

document.getElementById("friendsBtn").addEventListener("click", function() {
    document.getElementById("friendsList").style.display = "block";
    document.getElementById("requestsPopup").style.display = "none";
    document.getElementById("searchContainer").style.display = "none";
});

document.getElementById("closePopup").addEventListener("click", function() {
    document.getElementById("searchContainer").style.display = "none";
    document.getElementById("friendsList").style.display = "block";
});
document.getElementById("closePopupBtn").addEventListener("click", function() {
    document.getElementById("requestsPopup").style.display = "none";
    document.getElementById("friendsList").style.display = "block";
});








