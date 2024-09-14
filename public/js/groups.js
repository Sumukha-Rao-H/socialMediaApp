
document.getElementById("createGroupBtn").addEventListener('click', function() {
    document.getElementById('createGroupModal').style.display = 'block';
});

document.getElementById("createGroupForm").addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const groupName = document.getElementById('groupName').value;
    console.log('Group Name:', groupName);
    try {
        const response = await fetch('/create-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ groupName })
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Group created successfully!');
            document.getElementById('createGroupModal').style.display = 'none';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error creating group:', error);
    }
});
