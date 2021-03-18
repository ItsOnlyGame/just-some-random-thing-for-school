async function getTop10Memes() {

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    const response = await fetch('/api/scoreboard/top10', options)
    return await response.json();
}

async function createTableContent() {
    const data = await getTop10Memes();
    const memes = data.data;
    const table = document.getElementById("scoreboard");

    for (const meme of memes) {
        var row = table.insertRow();

        createCellToTable(meme.name, row);
        createCellToTable(meme.redditUrl, row, {enabled: true, link: meme.redditUrl});
        createCellToTable(meme.memeId.split(":")[0], row);
        createCellToTable(meme.score, row);
        createCellToTable("Click me", row, {enabled: true, link: meme.imageUrl});
    }

}

function createCellToTable(key, row, href = {enabled: false, link: "", target: "_blank"}) {
    let cell = row.insertCell();

    if (href.enabled) {
        var a = document.createElement("a");
        a.href = href.link;
        a.target = href.target;
        a.innerHTML = key;
        a.style = "color: white";
        cell.append(a)
    } else {
        cell.append(key)
    }

}

createTableContent();