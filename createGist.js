const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { linkName, linkURL } = JSON.parse(event.body);

    const gistData = {
        description `Link ${linkName}`,
        public false,
        files {
            [`${linkName}.txt`] {
                content linkURL
            }
        }
    };

    const response = await fetch('httpsapi.github.comgists', {
        method 'POST',
        headers {
            'Authorization' `token ${process.env.GITHUB_TOKEN}`,
            'Accept' 'applicationvnd.github.v3+json',
            'Content-Type' 'applicationjson'
        },
        body JSON.stringify(gistData)
    });

    const data = await response.json();
    return {
        statusCode 200,
        body JSON.stringify({ url data.html_url })
    };
};
