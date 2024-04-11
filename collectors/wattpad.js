const collectorName = "Wattpad";
const collectorRegex = /^(?:https?:\/\/)?(?:www\.)?wattpad\.com\/(?:story\/)?(\d+)-.*$/i;

const cheerio = require('cheerio');
const axios = require('axios');
const config = require('../bin/config.json');

///////////////
// FUNCTIONS //
///////////////

var collectionProcess = async function(url) {

    // Setup Variables
    var chapter_cheerio_data = [];
    var chapter_text_data = [];
    var chapter_html_data = [];

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

    // Grab chapter list
    var chapterListElement = $('ul.table-of-contents');
    var chapterList = [];
    chapterListElement.children().each((ci, chapter) => {
        chapterList.push({
            "text": $(chapter).text().trim(),
            "link": `https://www.wattpad.com${$(chapter).children().first().attr('href')}`
        });
    });
    console.log("DEBUG: Found "+chapterList.length+" chapters")

    // Retrieve all chapters
    var responses = await promiseAllChapters(chapterList.map(chapter => chapter.link));

    // Iterate through all of the chapters
    responses.forEach(response => {

        // Load webpage data into $
        var chapterUrl = response.config.url;
        var html = cheerio.load(response.data);

        // Pull all paragraphs into one object
        var storyID = collectorRegex.exec(chapterUrl)[1]
        var paragraphs = html(`div#sp${storyID}-pg1 > div > pre`);

        // Get Text and HTML data
        var html_data = "";
        var text_data = "";
        $(paragraphs).children().each((index, child) => {
            text_data += $(child).text()+"\n";
            html_data += $(child).html().trim()+"<br>";
        });

        // Put chapter data in the global variable so that order is maintained
        chapter_cheerio_data.push({
            title: html(`header.panel h1.h2`).text(),
            data: $(paragraphs)
        });

        chapter_text_data.push({
            title: html(`header.panel h1.h2`).text(),
            data: text_data
        });

        chapter_html_data.push({
            title: html(`header.panel h1.h2`).text(),
            data: html_data
        });
    });

    return {
        title: title,
        author: author,
        chapter_text: chapter_text_data,
        chapter_html: chapter_html_data,
        chapter_cheerio: chapter_cheerio_data
    }
}

async function promiseAllChapters(chapterList) {

    var promises = [];

    // Get all chapters asyncronously
    chapterList.forEach(url => {
        promises.push(axios.request({
            method: "GET",
            url: url,
            headers: config.requests.headers
        }));
    });

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