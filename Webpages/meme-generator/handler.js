async function execute() {
    const loading_text = document.getElementById("pic-loading");
    const info_text = document.getElementById("pic-info");
    const image = document.getElementById("pic");

    image.src = "";
    loading_text.innerHTML = "Loading...";

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    const response = await fetch('/api/meme', options)
    const json = await response.json();


    image.src = json.image_url;
    loading_text.innerHTML = "";
    info_text.innerHTML = json.reddit_url;
    info_text.href = json.reddit_url;
}


document.addEventListener('keypress', (e) => {
    if (e.key == ' ') {
        execute();
    }
});