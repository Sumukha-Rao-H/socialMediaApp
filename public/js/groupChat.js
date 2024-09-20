document.getElementById('showMembersBtn').addEventListener('click', function() {
    document.getElementById('membersList').classList.toggle('hidden');
});

document.addEventListener('DOMContentLoaded', function() {
    // Variables for popups and overlay
    const groupIcon = document.getElementById('groupIcon');
    const overlay = document.getElementById('overlay');
    const popupMenu = document.getElementById('popupMenu');
    const closePopupBtn = document.getElementById('closePopup');
    const addMembersBtn = document.getElementById('addMembersBtn');
    const addMembersPopup = document.getElementById('addMembersPopup');
    const closeAddMembersPopup = document.getElementById('closeAddMembersPopup');

    // Open and close popup menu
    function openPopup() {
        overlay.classList.remove('hidden');
        popupMenu.classList.remove('hidden');
    }

    function closePopup() {
        overlay.classList.add('hidden');
        popupMenu.classList.add('hidden');
        addMembersPopup.classList.add('hidden'); // Ensure both menus are hidden when clicking overlay
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

    if (addMembersBtn) {
        addMembersBtn.addEventListener('click', () => {
            addMembersPopup.classList.remove('hidden');
            overlay.classList.remove('hidden');
        });
    }

    if (closeAddMembersPopup) {
        closeAddMembersPopup.addEventListener('click', () => {
            addMembersPopup.classList.add('hidden');
            overlay.classList.add('hidden');
        });
    }

    // Right-click context menu for promoting members to admin
    const contextMenu = document.getElementById('contextMenu');
    const promoteBtn = document.getElementById('promoteToAdminBtn');
    let selectedMemberId = null;

    // Get groupId, isAdmin, and groupAdmins from server-side EJS

    // Show context menu on right-click for members
    document.querySelectorAll('.member-item').forEach(item => {
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Prevent default browser context menu

            selectedMemberId = this.getAttribute('data-member-id'); // Store the member's ID

            // Show the custom context menu only if the user is an admin and the member is not an admin
            if (isAdmin && !groupAdmins.includes(selectedMemberId)) {
                contextMenu.style.top = `${e.pageY}px`;  // Position the menu at the click location
                contextMenu.style.left = `${e.pageX}px`;
                contextMenu.classList.remove('hidden');
                contextMenu.classList.add('visible');
            }
        });
    });

    // Handle the promotion to admin button click
    promoteBtn.addEventListener('click', async function() {
        if (selectedMemberId) {
            // Use fetch to send a POST request to promote the member to admin
            try {
                const response = await fetch(`/groups/${groupId}/promote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({ memberId: selectedMemberId })
                });

                if (response.ok) {
                    location.reload(); // Reload the page to reflect the changes
                } else {
                    console.error('Failed to promote member');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        contextMenu.classList.add('hidden'); // Hide the context menu after promotion
    });

    // Hide context menu on a general click anywhere
    document.addEventListener('click', function() {
        contextMenu.classList.add('hidden'); // Hide the menu
        contextMenu.classList.remove('visible'); // Hide the menu
    });
});


