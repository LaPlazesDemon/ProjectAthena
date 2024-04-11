const collectorName = "Wattpad";
const collectorRegex = /^(?:https?:\/\/)?(?:www\.)?wattpad\.com\/(?:story\/)?(\d+)-.*$/i;

const cheerio = require('cheerio');
const axios = require('axios');
const config = require('../config.json');

///////////////
// FUNCTIONS //
///////////////

var collectionProcess = async function(url) {

    // Pull story id from URL
    var storyID = collectorRegex.exec(url)[1]
    console.debug(`DEBUG: Story ID: ${storyID}`);


    // Download main page
    var response = await axios.request({
        method: "GET",
        url: url,
        headers: config.requests.headers
    });

    // Load page into cheerio variable
    var $ = cheerio.load(response.data);

    // Grab story metadata
    var title = $(`span.info > h2.title`).text().trim();
    var author = $(`span.info > span.author`).text().replace("by", "").trim();

    // Grab all chapters
    var chapterListElement = $('ul.table-of-contents');
    var chapterList = [];
    chapterListElement.children().each((ci, chapter) => {
        chapterList.push({
            "text": $(chapter).text().trim(),
            "link": `https://www.wattpad.com${$(chapter).children().first().attr('href')}`
        });
    });
    console.log("DEBUG: Found "+chapterList.length+" chapters")

    promiseAllChapters(chapterList.map(chapter => chapter.link))
    .then(chapters => {
        chapters.forEach(chapter => {
            $(`div#sp${storyID}-pg1 > div > pre`).children().each((pi, paragraph) => {
                console.log($(paragraph).text())
            });
        });
    });

}

async function promiseAllChapters(chapterList) {

    // Get all chapters asyncronously
    var promises = chapterList.map(url =>
        axios.request({
            method: "GET",
            url: url,
            headers: config.requests.headers
        }).then(response => response.data)
        .catch(error => {
            console.error(`Error occurred while fetching data from ${url}:`, error);
            throw error; 
        })
    );

    return Promise.all(promises);
}

/////////////
// EXPORTS //
/////////////

module.exports = {
    collectorName: collectorName,
    collectorRegex, collectorRegex,
    process: collectionProcess
}