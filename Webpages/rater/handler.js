var current_meme_id = "";
var current_meme_url = "";

const meme_queue = [];

async function new_meme() {
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
                
            json.memes.forEach(meme => {
                meme_queue.push(meme);
            });
            resolve();
        });
    }

    if (meme_queue.length == 0) {
        await promise;
    }

    const meme = meme_queue.pop();
    
    current_meme_id = meme.id;
    current_meme_url = meme.image_url;

    image.src = meme.image_url;
    loading_text.innerHTML = "";
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


async function vote(vote_type) {
    if (current_meme_id === '' || current_meme_url === '') return;

    const data = {
        vote: vote_type,
        id: current_meme_id,
        url: current_meme_url,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api/rate', options);
    response.json();
    new_meme();
}