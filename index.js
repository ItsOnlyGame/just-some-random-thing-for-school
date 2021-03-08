const express = require('express');
const redditImageFetcher = require('reddit-image-fetcher');
const Datastore = require("nedb");

var PORT = process.env.PORT || 4000;

const app = express();
app.listen(PORT, () => console.log(`listening at port ${PORT}`));

/*
*   Settings some express routes
*   Webpages folder holds every webpage on the website
*/
app.use('/', express.static("Webpages/main"))
app.use('/meme-generator', express.static('Webpages/meme-generator'));
app.use('/rater', express.static('Webpages/rater'))

// Public data used on every page
app.use('/memes', express.static('public'));

// Set fetch format to json so it's easily read
app.use(express.json());

app.post('/api/meme', (request, response) => {
    redditImageFetcher.fetch({
        type: 'custom',
        total: 20, 
        subreddit: ['memes', 'funny'], 

    }).then((memes) => {
        const array = [];

        memes.forEach(meme => {
            array.push({
                image_url: meme.image,
                reddit_url:meme.postLink,
                id: meme.subreddit+':'+meme.id,
            })
        });


        response.json({
            status: "Success",
            memes: array,
        });

    }).catch((err) => {
        console.log(err)
        response.json({
            status: "Error",
            error: err
        });
    });
});

const db = new Datastore('datastore.db');
db.loadDatabase();
db.persistence.setAutocompactionInterval(30000);

app.post('/api/rate', (request, response) => {
    console.log(request.body);

    const data = {
        vote: request.body.vote,
        id: request.body.id,
        url: request.body.url,
    };

    db.findOne({id: data.id}, {upsert: true}, (err, doc) => {
        if (doc == null) { //No match, so this meme has now yet been reviewed
            data.vote = (data.vote === 'up' ? 1 : -1);
            db.insert(data);
        } else {
            data.vote = (data.vote === 'up' ? 1 : -1) + doc.vote;
            db.update({ id: data.id }, data);
        }
    })


    response.json({
        status: "Success"
    });
    db.save
});