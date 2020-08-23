const http = require('http');
const DOMParser = require('dom-parser');
const mustache = require('mustache');
const fetch = require('node-fetch');
const path = require('path');

const flatCache = require('flat-cache')
const cache = flatCache.load('8ec10f93dd39170d70e853af230c5a8159520d22', path.resolve('./cache'));


const APP_PORT = process.env.PORT || 5033;

// in seconds
const CACHE_VALIDITY = 10
// const CACHE_VALIDITY = process.env.CACHE_VALIDITY || (240 * 60);


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

//simple hash method
//source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
Object.defineProperty(String.prototype, 'simpleHash', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});




http.createServer(async (req, res) => {

        let currentTimestamp = Math.floor(Date.now() / 1000);


        if ((currentTimestamp - CACHE_VALIDITY) > (cache.getKey('lastCacheTimestamp') || 0)) {

            cache.setKey('lastCacheTimestamp', currentTimestamp);

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


            var hash = title.simpleHash()

            let cachedItemsHash = cache.getKey('cachedItemsHash') || [];

            if (cachedItemsHash.indexOf(hash) === -1) {


                let cachedItems = cache.getKey('cachedItems') || [];

                item = {
                    title: title,
                    link: 'https://torrentfreak.com/top-10-most-torrented-pirated-movies/',
                    description: table,
                }

                cachedItems.push(item);

                cache.setKey('cachedItems', cachedItems);

                cachedItemsHash.push(hash);
                cache.setKey('cachedItemsHash', cachedItemsHash);

                cache.save()

            }
            
        }

    let data = {
        title: 'Top 10 Most Torrented Movies of The Week',
        link: 'https://torrentfreak.com/top-10-most-torrented-pirated-movies/',
        items: cache.getKey('cachedItems') || []
    }



    var output = mustache.render(TEMPLATE, data);

    res.writeHead(200, {'Content-Type': 'application/rss+xml'});
    res.write(output);
    res.end()

    ;

}).listen(APP_PORT, '0.0.0.0');


