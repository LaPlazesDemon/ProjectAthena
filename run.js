var fs = require('fs');
const { exit } = require('process');
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs');

var collectorMatch = false;
var formatterMatch = false;

var collectorList = [];
var formatterList = [];

var selectedFormatter;

// Get list of available formatters
fs.readdirSync("formatters").forEach(file => {
    if (file.endsWith(".js")) {
        var formatter = require(`./formatters/${file}`);
        formatterList.push(formatter.formatterId);
    }
});

// Define Command Line Arguments
const options = yargs
  .usage('Usage: $0 [options]')
  .option('url', {
    describe: 'URL of the work',
    type: 'string',
    demandOption: true 
  })
  .option('format', {
    describe: 'Which formatter to use',
    type: 'string',
    demandOption: true,
    choices: formatterList
  })
  .option('no-toc', {
    describe: 'Disable creating a Table of Contents in the formatters that support them',
    type: 'boolean',
    default: false
  })
  .help()
  .argv;

// Check to see if the given formatter exists
fs.readdirSync("formatters").forEach(file => {
    if (file.endsWith(".js")) {
        var formatter = require(`./formatters/${file}`);

        if (options.formatter == formatter.formatterId) {
            console.log(`INFO: Matched formatter with ${formatter.formatterName}`);
            formatterMatch = true;
            selectedFormatter = formatter
        }
    }
});


// Match the URL with the right collector
fs.readdirSync("collectors").forEach(async file => {
    if (file.endsWith(".js")) {
        
        var collector = require(`./collectors/${file}`);
        collectorList.push(collector.collectorName);

        if (options.url.match(collector.collectorRegex)) {
            console.log(`INFO: Matched url with ${collector.collectorName}`);
            collectorMatch = true;
            var data = await collector.process(options.url);
            selectedFormatter.format(data);
        }
    }
});

if (!collectorMatch) {
    console.error("ERROR: Count not find a matching collector for url "+options.url)
}

