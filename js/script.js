
async function getLinks() {
    try {
        const response = await fetch(`https://api.github.com/gists/f576f82efa6a00428faf550df3ac1a36`);
        const gist = await response.json();

        // Check if the 'links.json' file exists
        if (!gist.files || !gist.files['links.json']) {
            throw new Error("The file 'links.json' does not exist in the Gist.");
        }

        const fileContent = gist.files['links.json'].content;

        // Check if the content is a valid JSON string
        if (!fileContent) {
            throw new Error("The content of 'links.json' is empty or undefined.");
        }

        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error retrieving links:", error.message);
        return [];
    }
}

// Function to render the table with the fetched links
function renderTable() {
    const tableBody = document.querySelector("#linkTable tbody");
    tableBody.innerHTML = ""; // Clear any existing rows

    if (links.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='2'>No links available</td></tr>";
        return;
    }

    links.forEach(link => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="name-column">${link.name}</td>
            <td class="url-column"><a href="${link.url}" target="_blank">${link.url}</a></td>
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    links = await getLinks();
    renderTable();
});

async function saveLink() {
    const name = document.getElementById('websiteName').value;
    const url = document.getElementById('websiteURL').value;
    const messageDiv = document.getElementById('message');

    if (!name || !url) {
        messageDiv.innerHTML = "Please enter both a website name and URL.";
        messageDiv.style.color = "red";
        return;
    }

    if (!isValidURL(url)) {
        messageDiv.innerHTML = "Please enter a valid URL.";
        messageDiv.style.color = "red";
        return;
    }

    const newLink = { 'name':name, 'url':url };
    try {
        await updateGist(newLink);
        messageDiv.innerHTML = "Link saved successfully!";
        messageDiv.style.color = "green";
        document.getElementById('websiteName').value = '';
        document.getElementById('websiteURL').value = '';
    } catch (error) {
        messageDiv.innerHTML = "Failed to save the link.";
        messageDiv.style.color = "red";
        console.error(error);
    }
}

// Function to validate URL
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}


async function updateGist(newLinks) {
    try {
        // Step 1: Fetch the existing content
        const fetchResponse = await fetch(`https://api.github.com/gists/f576f82efa6a00428faf550df3ac1a36`, {
            headers: {
                'Authorization': `token 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`
            }
        });

        if (!fetchResponse.ok) {
            throw new Error('Failed to fetch the Gist.');
        }

        const gist = await fetchResponse.json();
        const content = gist.files['links.json']?.content;

        if (!content) {
            throw new Error("The file 'links.json' does not exist or has no content.");
        }

        let existingContent;
        try {
            existingContent = JSON.parse(content);
        } catch (e) {
            throw new Error("Error parsing JSON content: " + e.message);
        }

        // Ensure existing content is an array
        if (!Array.isArray(existingContent)) {
            throw new Error("The existing content is not an array.");
        }

        // Step 2: Append the new data using push
        existingContent.push(newLinks);

        // Step 3: Update the Gist with the appended content
        const updateResponse = await fetch(`https://api.github.com/gists/f576f82efa6a00428faf550df3ac1a36`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token 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`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'links.json': {
                        content: JSON.stringify(existingContent, null, 2)
                    }
                }
            })
        });

        if (updateResponse.ok) {
            const updatedGist = await updateResponse.json();
            console.log(`Gist updated successfully`);
                // Fetch updated links and re-render the table
            links = await getLinks();
            renderTable();
        } else {
            throw new Error('Failed to update the Gist: ' + updateResponse.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}
