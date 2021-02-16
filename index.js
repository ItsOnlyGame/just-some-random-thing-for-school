const { urlencoded } = require('express');
const express = require('express');
const redditImageFetcher = require('reddit-image-fetcher');

const app = express();
app.listen(80, () => console.log('listening at port 80'));

app.use(express.static('public'));
app.use(express.json());

app.post('/api', (request, response) => {
    redditImageFetcher.fetch({type: request.body.type}).then((img) => {
        response.json({
            status: "Success",
            image: img[0]
        });
    });
});