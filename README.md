# Design System Sniffer

React based style sniffer. MVP used for demo at [RenderATL 2025](https://www.renderatl.com/)

## To get started

In the project directory, run:

### `npm analyze {website_url}`

website_url should be formatted http://example.com

**Note: this scrapes a website's styles with puppeteer. Will timeout if website disallows scrapping or if request exceeds a minute**

After analysis is complete, open local React app by running:

### `npm start`

This runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
