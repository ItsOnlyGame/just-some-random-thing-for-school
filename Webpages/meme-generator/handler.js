async function execute() {
    const loading_text = document.getElementById("pic-loading");
    const info_text = document.getElementById("pic-info");
    const image = document.getElementById("pic");

    image.src = "";
    loading_text.innerHTML = "Loading...";

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


    console.log(json);

    image.src = json.image.image;
    loading_text.innerHTML = "";
    info_text.innerHTML = json.image.postLink;
    info_text.href = json.image.postLink;

}


document.addEventListener('keypress', (e) => {
    if (e.key == ' ') {
        execute();
    }
});