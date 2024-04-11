var fs = require('fs');
const { exit } = require('process');

var collectorMatch = false;
var formatterMatch = false;

var collectorList = [];
var formatterList = [];

var url = process.argv[2];
var paramFormatter = process.argv[3];
var selectedFormatter;

// Check if the right number of parameters were passed
if (process.argv.length != 4) {
    console.error(`ERROR: Bad number of parameters passed
Usage: node run <url> <formatter>`);
    exit(1);
}


// Check to see if the given formatter exists
fs.readdirSync("formatters").forEach(file => {
    if (file != "template.txt") {
        var formatter = require(`./formatters/${file}`);
        formatterList.push(`${formatter.formatterId} - ${formatter.formatterName}`)

        if (paramFormatter == formatter.formatterId) {
            console.log(`INFO: Matched formatter with ${formatter.formatterName}`);
            formatterMatch = true;
            selectedFormatter = formatter
        }
    }
});

if (!formatterMatch) {
    console.error(`ERROR: Formatter ${paramFormatter} not found.
Available Formatters: 
    ${formatterList.join("\n  ")}`);
    exit(2);
}


fs.readdirSync("collectors").forEach(async file => {
    if (file != "template.txt") {
        
        var collector = require(`./collectors/${file}`);
        collectorList.push(collector.collectorName);

        if (url.match(collector.collectorRegex)) {
            console.log(`INFO: Matched url with ${collector.collectorName}`);
            collectorMatch = true;
            var data = await collector.process(url);
            selectedFormatter.format(data);
        }
    }
});

if (!collectorMatch) {
    console.error("ERROR: Count not find a matching collector for url "+process.argv[2])
}

