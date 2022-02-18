import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';

import DirectoryListing from '../src/pages/DirectoryListing';

const DirSecChecker = (req, res, next) => {
    if (req.path.includes("/.."))           //Illegal path, render the 403 forbidden page
        res.status(403).send("403 Forbidden");    
    else next();
}

const IsDir = (req, res, next) => {
    if (!req.path.endsWith("/"))            //The client requested a non existing static file, render the 404 page
        res.status(404).send("404 Not Found : File not found");
    else next();
}

const DirExists = (req, res, next) => {
    if (!fs.existsSync(process.cwd() + '/public' + req.path))   //The requested directory does not exist, render the 404 page
        res.status(404).send("404 Not Found : Directory not found");    
    else next();
}

const RenderDirIndex = (req, res) => {
    const html = ReactDOMServer.renderToString(<DirectoryListing />);
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${process.cwd()}</title>
                <link rel="stylesheet" href="/css/style.css" />
                <script src="/js/app.js"></script>
            </head>
            <body>
                <div id="root">${html}</div>
            </body>
        </html>
    `);    
}

export default [DirSecChecker, IsDir, DirExists, RenderDirIndex];

