const meme_queue = [];

async function execute() {
    const loading_text = document.getElementById("meme-loading");
    const info_text = document.getElementById("meme-info");
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

    image.src = meme.image_url;
    loading_text.innerHTML = "";

    info_text.innerHTML = meme.reddit_url;
    info_text.href = meme.reddit_url;
}

execute();

document.addEventListener('keypress', (e) => {
    if (e.key == ' ') {
        execute();
    }
});

