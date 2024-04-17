const formatterName = "HTML File"
const formatterId = "html"

const cheerio = require("cheerio");
const config = require('../bin/config.json');
const fs = require('fs');

const format = function(storyData, options) {

    var output = `
<h1>${storyData.title}</h1>
<h3>By: ${storyData.author}</h3>
${(function(){if (storyData.tags != undefined) {return `<div class='tags'><strong>Tags:</strong> ${storyData.tags.join(", ")}</div>`} else {return ""}})()}
${(function(){if (!options.skipToc) {return generateTOC(storyData);} else {return ""}})()}
${(function(){if (storyData.introduction != undefined) {return `<h3>Introduction</h3><p>${storyData.introduction}</p>`} else {return ""}})()}
`;

storyData.chapter_html.forEach((chapter, index) => {

    output += `
    
    <h3 id="chapter${index}">${chapter.title.trim()}</h3>`;

    text = chapter.data;
    if (text.replaceAll(" ",).replaceAll("\n", "") !== "") {
        output += text+"<br>"
    }

});

    var htmlTemplate = fs.readFileSync("./bin/html_template.html")
    var $ = cheerio.load(htmlTemplate);

    $('body').html(output);
    fs.writeFileSync(`${config.output.directory}/${storyData.title} by ${storyData.author}.html`, $.html());
}

function generateTOC(data) {
    var toc = "<div class='toc'><h3>Table of Contents</h3>";
    toc += data.chapter_html.map((chapter, index) => `- <a href='#chapter${index}'>${chapter.title.trim()}</a>\n`).join('<br>');
    toc += "</div>"

    return toc;
}


module.exports = {
    formatterName: formatterName,
    formatterId: formatterId,
    format: format
}