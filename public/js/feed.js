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

document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', async function() {
        const postId = this.getAttribute('data-post-id');
        const isLiked = this.getAttribute('data-liked') === 'true';  // Check if post is already liked
        
        try {
            let response;
            if (isLiked) {
                // Unlike the post
                response = await fetch(`/unlike/${postId}`, {
                    method: 'POST'
                });
            } else {
                // Like the post
                response = await fetch(`/like/${postId}`, {
                    method: 'POST'
                });
            }
            
            const result = await response.json();

            if (response.ok) {
                // Update the like count in the UI
                const likeCountElement = this.querySelector('.like-count');
                likeCountElement.textContent = result.likes; // Update the like count

                // Toggle the button text based on the action
                if (isLiked) {
                    this.setAttribute('data-liked', 'false');
                } else {
                    this.setAttribute('data-liked', 'true');
                }
            } else {
                alert(result.message); // Show error message if any
            }
        } catch (err) {
            console.error('Error:', err);
        }
    });
});
