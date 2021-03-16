var currentMeme;

const meme_queue = [];

async function new_meme() {
    const info_text = document.getElementById("meme-info");
    const loading_text = document.getElementById("meme-loading");
    const image = document.getElementById("meme");
        
    image.src = "";
    loading_text.innerHTML = "Loading...";

    if (meme_queue.length < 5) {
        var promise = new Promise(async(resolve) => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            const response = await fetch('/api/meme', options)
            const json = await response.json();
            

            json.data.forEach(meme => {
                meme_queue.push(meme);
            });
            resolve();
        });
    }

    if (meme_queue.length == 0) {
        await promise;
    }

    const meme = meme_queue.pop();
    currentMeme = meme;

    setMemeScore();

    image.src = meme.imageUrl;
    loading_text.innerHTML = "";

    info_text.innerHTML = meme.redditUrl;
    info_text.href = meme.redditUrl;
}

new_meme();

document.getElementById("up-vote").addEventListener('click', () => {
    vote("up");

});

document.getElementById("down-vote").addEventListener('click', () => {
    vote("down");
});

document.getElementById("bnt-skip").addEventListener('click', () => {
    new_meme();
});


const meme = document.getElementById("meme_url");
meme.addEventListener('click', () => {
    meme.href = document.getElementById("meme").src;
});


async function vote(vote_type) {
    if (currentMeme === undefined) return;

    const data = {
        vote: vote_type,
        meme: currentMeme
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api/vote', options);
    response.json();
    new_meme();
}

async function setMemeScore() {
    const data = {
        id: currentMeme.memeId
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    const response = await fetch('/api/scoreboard/get', options);
    const json = await response.json();

    console.log(json)

    document.getElementById("score-info").innerHTML = `Score: ${json.data}`;
}