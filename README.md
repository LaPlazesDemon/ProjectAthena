# Project Athena
 This is a long-term project for saving user-generated stories for offline usage


### Supported Sites
- None :)

### Supported Formats
- txt [.txt]

### Usage

Modify the `config.json` file to change the output directory 
```bash
node run <url> <output format>
```

### Adding formatters

Currently I only have .txt file output supported but I will be adding other formats. However, if you want to add your own formatter, then I made it pretty simple using the `template.txt` file in the formatters folder.

To create your own formatter just add a new .js file in the formatters folder and follow this syntax

```javascript
const formatterName = "";
// This is the friendly name outputted in console
const formatterId = "";
// This will be the identifier used in the command

const format = function(storyData);
// This is the main function, once the collector is finished you can use the storyData however you see fit

// Here is what will be passed to the format function

// Any options with a '?' mean that they will only be passed if the collector is able to retrieve that data from the site and will return undefined if it cannot

var storyData = {
    title: "string",
    author: "string",
    tags?: "[string]",
    chapterData: [Array [Cheerio Elements]]
}
```

The `chapterData` tag is an array of every "chapter" or "part" of the story, in each array is another array of all of the Cheerio Elements. Some formats such as EPUB support direct HTML and CSS styling so the output can be stylized for use in those formats. I also just thing it's better in case images are included and you wish to import those into supported files