# Project Athena
 This is a long-term project for saving user-generated stories for offline usage


### Supported Sites
- Wattpad
- Quotev

### Supported Formats
- txt [.txt]
- html [.html]

### Usage

Modify the `config.json` file to change the output directory 
```bash
node run --url <url> --format <format>
```
Optional Arguments
```bash
--no-toc - Disables generating Table of Contents
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
    introduction?: "string",
    tags?: "[string]",
    chapter_text: string[],
    chapter_html: string[],
    chapter_cheerio: Cheerio Object[]
}
```
The `chapter_x` tags are the various outputs of the chapter data here are the formats:

`chapter_text` - An array of chapters where each chapter is a monolithic string containing all of the text with no formatting such a bold, italics, fonts etc. All stripped of HTML tags as well so no images or other data will be included

`chapter_html` - An array of chapters where each chapter is a monolithic string containing all of the literal HTML data pulled from the site, this will include any \<div\>, \<span\>, \<img\> tags as well. 
*Note: any \<script\> tags will be removed for obvious reasons*

`chapter_cheerio` - An array of chapters where each chapter is a monolithic Cheerio object. In case you want to do any advanced data manipulation or something here you go! The cheerio object be the root element of the story so the lowest 
