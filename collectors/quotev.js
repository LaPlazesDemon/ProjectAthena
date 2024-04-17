var collectorName = "Quotev";
var collectorRegex = /^https?:\/\/(?:www\.)?quotev\.com\/story\/\d+\/[a-zA-Z0-9-]+(?:\/\d+)?$/;

const cheerio = require('cheerio');
const axios = require('axios');
const config = require('../bin/config.json');


///////////////
// FUNCTIONS //
///////////////

var collectionProcess = async function(url) {

    // Strip chapter from URL
    var baseUrlRegex = /^https?:\/\/(?:www\.)?quotev\.com\/story\/\d+\/[a-zA-Z0-9-]+/;
    var baseUrl = url.match(baseUrlRegex)[0];

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

    // Load HTML Elements
    var $ = cheerio.load(response.data);

    // Grab story metadata
    var title = $('#quizHeaderTitle > h1').text();
    var author = $('#quizHeaderTitle > div.quizAuthorList > div > a').text();
    var intro = $('#quizHeaderTitle > div:nth-child(3) > div').text();
    var tags = [];

    // Grab story tags
    var tagDiv = $('#quizHeaderTitle > div:nth-child(3) > div > div > div');
    tagDiv.children().each((index, element) => {
        tags.push($(element).text())
    });

    // Get list of chapter URLs
    // URL Structure: www.quotev.com/story/<story id>/<story name>/<chapter #>
    var chapters = $('#footer_pages > form > span > select').children().length;
    var chapterUrls = Array.from({ length: chapters }, (_, index) => `${baseUrl}/${index+1}`);

    // Grab all pages
    var chaptersRequest = await promiseAllChapters(chapterUrls);

    // Process all chapters
    chaptersRequest.forEach(response => {

        // Load webpage data into html
        var html = cheerio.load(response.data.b);

        // Pull all paragraphs into one object
        var paragraphs = html(`#rescontent`);

        // Get Text and HTML data
        var html_data = "";
        var text_data = "";
        $(paragraphs).children().each((index, child) => {
            if (!html(child).hasClass('qfooter')) {
                text_data += html(child).text().replace("<br>", "\n")+"\n";
                html_data += html(child).html().trim()+"<br>";
            }
        });

        // Put chapter data in the global variable so that order is maintained
        chapter_cheerio_data.push({
            title: html(`#quizSubtitle`).text(),
            data: $(paragraphs)
        });

        chapter_text_data.push({
            title: html(`#quizSubtitle`).text(),
            data: text_data
        });

        chapter_html_data.push({
            title: html(`#quizSubtitle`).text(),
            data: html_data
        });
    });

    return {
        title: title,
        author: author,
        tags: tags,
        introduction: intro,
        chapter_text: chapter_text_data,
        chapter_html: chapter_html_data,
        chapter_cheerio: chapter_cheerio_data
    }
}

// Pass list of chapter URLs and get them all concurrently
async function promiseAllChapters(chapterList) {

    var promises = [];

    // Get all chapters asyncronously
    chapterList.forEach(url => {
        promises.push(axios.request({
            method: "GET",
            url: url,
            headers: config.requests.quotev_headers
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


fetch("https://www.quotev.com/story/7504266/Facade/11", {
    "cache": "default",
    "credentials": "include",
    "headers": {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Pragma": "no-cache",
        "Priority": "u=3, i",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
        "X-Ajax": "1",
        "X-Ajax-Page": "1",
        "X-Json": "1"
    },
    "method": "GET",
    "mode": "cors",
    "redirect": "follow",
    "referrer": "https://www.quotev.com/story/7504266/Facade/1",
    "referrerPolicy": "strict-origin-when-cross-origin"
})