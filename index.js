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
app.use('/meme-review', express.static('Webpages/meme-review'))
app.use('/scoreboard', express.static('Webpages/scoreboard'))

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
                name: meme.title,
                imageUrl: meme.image,
                redditUrl:meme.postLink,
                memeId: meme.subreddit+':'+meme.id,
            })
        });

        respond(response, array);
    }).catch((err) => {
        respond(response, err, false);
    });
});

/**
 * Load database to memory
 * Compact database file content every 30 000ms (30s)
 */
const db = new Datastore('datastore.db');
db.loadDatabase();
db.persistence.setAutocompactionInterval(30000);

app.post('/api/vote', (request, response) => {
    const data = {
        vote: request.body.vote,
        meme: request.body.meme
    };

    db.findOne({id: data.id}, {upsert: true}, (err, doc) => {
        if (doc == null) { //No match, so this meme has now yet been reviewed
            data.meme.score = (data.vote === 'up' ? 1 : -1);
            db.insert(data.meme);
        } else {
            data.meme.score = (data.vote === 'up' ? 1 : -1) + doc.score;
            db.update({ id: data.meme.id }, data.meme);
        }
    })

    respond(response, undefined);
});

app.post('/api/scoreboard/get', (request, response) => {
    console.log(request.body)
    db.findOne({id: request.body.id}, {upsert: true}, (err, doc) => {
        respond(response, (doc == null ? 0 : doc.vote));
    })
});

app.post('/api/scoreboard/top10', (request, response) => {
    db.find({}, function (err, docs) {
        if (err) {
            respond(response, err, false);
            return;
        }

        var sorted = docs.sort((a, b) => b.vote - a.vote);
        const top10 = sorted.splice(0, 10);

        respond(response, top10);
    });

});

function respond(response, data, success = true) {
    response.json({
        status: success ? "Success" : "Error",
        data: data
    });
}