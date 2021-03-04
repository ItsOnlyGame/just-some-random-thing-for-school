var current_meme_id = "";

async function execute() {
    const loading_text = document.getElementById("meme-loading");
    const image = document.getElementById("meme");

    image.src = "";
    loading_text.innerHTML = "Loading...";

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    const response = await fetch('/api', options)
    const json = await response.json();

    console.log(json)
    
    current_meme_id = json.id;

    image.src = json.image_url;
    loading_text.innerHTML = "";
}

execute();