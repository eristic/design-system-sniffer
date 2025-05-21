# Design System Sniffer

Node based design anaylzer.

### To get started

In the project directory, run:

`npm run analyze {website_url}`

`website_url` should be formatted https://example.com

**Note: this scrapes a website's styles with puppeteer. Will timeout if website disallows scrapping or if request exceeds a minute**

After analysis is complete, open local React app by running:

`npm run dev`
