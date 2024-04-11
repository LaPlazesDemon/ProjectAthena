const formatterName = "HTML File"
const formatterId = "html"

const cheerio = require('cheerio');
const config = require('../config.json');
const fs = require('fs');

const format = function(storyData) {

    var output = `
<h1>${storyData.title}</h1>
<h3>By: ${storyData.author}</h3>
${(function(){if (storyData.tags != undefined) {return `Tags: ${storyData.tags.join(", ")}`} else {return ""}})()}
`;

storyData.chapter_html.forEach(chapter => {

    output += `
    
    <h2>${chapter.title}</h2>`;

    text = chapter.data;
    if (text.replaceAll(" ",).replaceAll("\n", "") !== "") {
        output += text+"<br>"
    }

});

fs.writeFileSync(`${config.output.directory}/${storyData.title} by ${storyData.author}.html`, output);
}

module.exports = {
    formatterName: formatterName,
    formatterId: formatterId,
    format: format
}