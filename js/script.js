document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveLinkForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const linkName = document.getElementById('linkName').value;
        const linkURL = document.getElementById('linkURL').value;

        try {
            const response = await fetch('/.netlify/functions/createGist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ linkName, linkURL })
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById('result').innerHTML = `Gist created: <a href="${result.url}" target="_blank">${result.url}</a>`;
            } else {
                document.getElementById('result').textContent = `Error: ${result.error}`;
            }
        } catch (error) {
            document.getElementById('result').textContent = `Error: ${error.message}`;
        }
    });
});
