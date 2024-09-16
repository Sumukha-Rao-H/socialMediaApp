document.getElementById('showMembersBtn').addEventListener('click', function() {
    document.getElementById('membersList').classList.toggle('hidden');
});

document.addEventListener('DOMContentLoaded', function() {
    const groupIcon = document.getElementById('groupIcon');
    const overlay = document.getElementById('overlay');
    const popupMenu = document.getElementById('popupMenu');
    const closePopupBtn = document.getElementById('closePopup');

    function openPopup() {
        overlay.classList.remove('hidden');
        popupMenu.classList.remove('hidden');
    }

    function closePopup() {
        overlay.classList.add('hidden');
        popupMenu.classList.add('hidden');
    }

    if (groupIcon) {
        groupIcon.addEventListener('click', openPopup);
    }

    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closePopup);
    }

    if (overlay) {
        overlay.addEventListener('click', closePopup);
    }
});