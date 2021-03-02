const { urlencoded } = require('express');
const express = require('express');
const redditImageFetcher = require('reddit-image-fetcher');

var PORT = 4000;

const app = express();
app.listen(PORT, () => console.log(`listening at port ${PORT}`));


app.use('/', express.static("Webpages/main"))
app.use('/meme-generator', express.static('Webpages/meme-generator'));
app.use('/rater', express.static('Webpages/rater'))


app.use(express.static('public'));

app.use(express.json());

app.post('/api', (request, response) => {
    if (request.body.type == 'custom') {
        redditImageFetcher.fetch({
            type: 'meme',
            total: 50, 
            addSubreddit: ['memes', 'funny'], 
            removeSubreddit: ['dankmemes']
        }).then((images) => {
            
        }); 

    } else {
        redditImageFetcher.fetch({type: request.body.type}).then((img) => {
            response.json({
                status: "Success",
                image: img[0]
            });
        });
    }
});