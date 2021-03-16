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
        createCellToTable(meme.redditUrl, row, true);
        createCellToTable(meme.memeId.split(":")[0], row);
        createCellToTable(meme.score, row);
    }

}

function createCellToTable(key, row, link = false) {
    let cell = row.insertCell();

    if (link) {
        var a = document.createElement("a");
        a.href = key;
        a.target = "_blank";
        a.innerHTML = key;
        a.style = "color: white";
        cell.append(a)
    } else {
        cell.append(key)
    }

}

createTableContent();