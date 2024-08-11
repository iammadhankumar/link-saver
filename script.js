// Function to handle saving the link
async function saveLink() {
    const linkName = document.getElementById('linkName').value;
    const linkURL = document.getElementById('linkURL').value;

    if (!linkName || !linkURL) {
        alert('Please enter both a link name and URL.');
        return;
    }

    try {
        const response = await fetch('/.js/createGist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ linkName, linkURL })
        });
        console.log(response);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            alert('Link saved successfully!');
            displayLink(linkName, linkURL);
            clearForm();
        } else {
            alert(`Failed to save the link: ${data.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred while saving the link.');
    }
}

// Function to display the saved link on the page
function displayLink(name, url) {
    const linkList = document.getElementById('linkList');
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.textContent = name;
    linkElement.target = '_blank';  // Opens link in a new tab
    linkElement.rel = 'noopener noreferrer';  // Security best practice
    linkList.appendChild(linkElement);
}

// Function to clear the input fields after saving
function clearForm() {
    document.getElementById('linkName').value = '';
    document.getElementById('linkURL').value = '';
}
