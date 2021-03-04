const express = require('express');
const redditImageFetcher = require('reddit-image-fetcher');

var PORT = process.env.PORT || 4000;

const app = express();
app.listen(PORT, () => console.log(`listening at port ${PORT}`));


app.use('/', express.static("Webpages/main"))
app.use('/meme-generator', express.static('Webpages/meme-generator'));
app.use('/rater', express.static('Webpages/rater'))


app.use('/memes', express.static('public'));
app.use(express.json());

app.post('/api', (request, response) => {
    redditImageFetcher.fetch({
        type: 'meme',
        total: 1, 
        subreddit: ['memes', 'funny'], 
    }).then((img) => {
        response.json({
            status: "Success",
            image_url: img[0].image,
            reddit_url:img[0].postLink,
            id: img[0].subreddit+img[0].id,
        });
    });
});