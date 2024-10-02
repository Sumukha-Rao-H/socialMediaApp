document.addEventListener('DOMContentLoaded', () => {
    const postBtn = document.querySelector('.postBtn');
    const overlay = document.querySelector('.overlay');
    const postUpload = document.querySelector('.postUpload');

    // Show the post form and overlay when clicking the button
    postBtn.addEventListener('click', () => {
        postUpload.style.display = 'block';
        overlay.style.display = 'block';
    });

    // Hide the post form and overlay when clicking the overlay
    overlay.addEventListener('click', () => {
        postUpload.style.display = 'none';
        overlay.style.display = 'none';
    });
});
