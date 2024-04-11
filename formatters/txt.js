const formatterName = "Text File"
const formatterId = "txt"

const cheerio = require('cheerio');
const config = require('../bin/config.json');
const fs = require('fs');

const format = function(storyData) {

    var output = `
Title: ${storyData.title}
By: ${storyData.author}
${(function(){if (storyData.tags != undefined) {return `Tags: ${storyData.tags.join(", ")}`} else {return ""}})()}
`;

storyData.chapter_text.forEach(chapter => {

    output += `
    
    ${chapter.title}`;

    text = chapter.data;
    if (text.replaceAll(" ",).replaceAll("\n", "") !== "") {
        output += text
    }

});

fs.writeFileSync(`${config.output.directory}/${storyData.title} by ${storyData.author}.txt`, output);
}

module.exports = {
    formatterName: formatterName,
    formatterId: formatterId,
    format: format
}