// require('dotenv').config({ path: '../.env' }); 
// import fetch from 'node-fetch';
const Dotenv = require('dotenv-webpack');




async function getLinks() {
    try {
        url=`https://api.github.com/gists/${process.env.GIST_TOKEN}`
        const response = await fetch(`https://api.github.com/gists/${process.env.GIST_TOKEN}`);
        const gist = await response.json();

        // Check if the 'links.json' file exists
        if (!gist.files || !gist.files['links.json']) {
            throw new Error("The file 'links.json' does not exist in the Gist.");
        }

        const fileContent = gist.files['links.json'].content;

        console.log("FILE CONTENT ",fileContent)

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

async function saveLink() {
    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
    const gistToken = process.env.NEXT_PUBLIC_GIST_TOKEN;
    const token = process.env.NEXT_PUBLIC_TOKEN;
    console.log("Gist Token:", gistToken);
    console.log("Token:", token);
    const name = document.getElementById('websiteName').value;
    const url = document.getElementById('websiteURL').value;
    const messageDiv = document.getElementById('message');

    if (!name || !url) {
        messageDiv.innerHTML = "Please enter both a website name and URL.";
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


async function updateGist(newLinks) {
    try {
        // Step 1: Fetch the existing content
        const fetchResponse = await fetch(`https://api.github.com/gists/${process.env.GIST_TOKEN}`, {
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
        console.log("existingContent ", existingContent)
        existingContent.push(newLinks);

        // Step 3: Update the Gist with the appended content
        const updateResponse = await fetch(`https://api.github.com/gists/${process.env.GIST_TOKEN}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${process.env.TOKEN}`,
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
            console.log(`Gist updated successfully: ${updatedGist.html_url}`);
        } else {
            throw new Error('Failed to update the Gist: ' + updateResponse.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

console.log("RES ",getLinks())