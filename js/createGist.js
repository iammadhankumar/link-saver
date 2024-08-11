const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { linkName, linkURL } = JSON.parse(event.body);

    const gistData = {
        description: `Link: ${linkName}`,
        public: false, // Set to true if you want the gist to be public
        files: {
            [`${linkName}.txt`]: {
                content: linkURL
            }
        }
    };

    try {
        const response = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gistData)
        });

        const data = await response.json();
        
        // Debugging info
        console.log('GitHub API response:', data);

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ url: data.html_url })
            };
        } else {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.message || 'Failed to create gist' })
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create gist' })
        };
    }
};
