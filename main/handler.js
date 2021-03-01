async function execute() {
    const text = document.getElementById("pic-text");
    const image = document.getElementById("pic");
    image.src = "";
    text.innerHTML = "Loading...";

    const type = document.getElementById("meme-type");
    const data = {
        type: type.value,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', options)
    const json = await response.json();

    image.src = json.image.image;
    text.innerHTML = "";
}


document.addEventListener('keypress', (e) => {
    if (e.key == ' ') {
        execute();
    }
});