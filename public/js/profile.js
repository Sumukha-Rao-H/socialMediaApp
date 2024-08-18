const profilePicture = document.getElementById('profilePicture');
const popupMenu = document.getElementById('popupMenu');
const overlay = document.getElementById('overlay');
const closePopup = document.getElementById('closePopup');

profilePicture.addEventListener('click', () => {
    popupMenu.classList.add('active');
    overlay.classList.add('active');
});

closePopup.addEventListener('click', () => {
    popupMenu.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    popupMenu.classList.remove('active');
    overlay.classList.remove('active');
});