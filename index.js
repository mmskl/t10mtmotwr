const http = require('http');
const DOMParser = require('dom-parser');
const mustache = require('mustache');
const fetch = require('node-fetch');

const APP_PORT = 5033


const TEMPLATE = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
  <channel>
  <title>{{title}}</title>
  <link>{{link}}</link>
  <description>{{description}}</description>


  {{#items}}

      <item>
        <title> {{title}} </title>
        <link> {{link}} </link>
        <description> {{description}} </description>
      </item>

  {{/items}}


</channel>
</rss>`;




http.createServer(async (req, res) => {

        const content = await fetch("https://torrentfreak.com/top-10-most-torrented-pirated-movies/", {
            method: "GET",
            headers: [
                ["Content-Type", "text/html"],
                ["User-Agent", "Firefox"],
            ]
        })

        let siteContent = await content.text();

        let parser = new DOMParser()

        const doc = parser.parseFromString(siteContent, "text/html");

        let article = doc.getElementsByClassName('article__body')[0]
        let title = article.getElementsByTagName('h2')[0].textContent
        let table = article.getElementsByTagName('table')[0].outerHTML

         let data = {
             title: 'Top 10 Most Torrented Movies of The Week',
             link: 'https://torrentfreak.com/top-10-most-torrented-pirated-movies/',
             items: [ {
                 title: title,
                 link: 'https://torrentfreak.com/top-10-most-torrented-pirated-movies/',
                 description: table,
             } ]
         }


        var output = mustache.render(TEMPLATE, data);

        res.writeHead(200, {'Content-Type': 'application/rss+xml'});
        res.write(output);
        res.end()

    ;

}).listen(APP_PORT, '0.0.0.0');


