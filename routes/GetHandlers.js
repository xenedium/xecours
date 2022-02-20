import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import DefaultPage from '../utility/DefaultPage';

import App from '../src/App';

const DirSecChecker = (req, res, next) => {
    if (req.path.includes("/.."))           //Illegal path, render the 403 forbidden page
        res.status(403).send(DefaultPage(ReactDOMServer.renderToString(<App/>)));
    else next();
}

const IsDir = (req, res, next) => {
    if (!req.path.endsWith("/"))            //The client requested a non existing static file, render the 404 page
        res.status(404).send(DefaultPage(ReactDOMServer.renderToString(<App/>)));
    else next();
}

const DirExists = (req, res, next) => {
    if (!fs.existsSync(process.cwd() + '/public' + req.path))   //The requested directory does not exist, render the 404 page
        res.status(404).send(DefaultPage(ReactDOMServer.renderToString(<App/>)));
    else next();
}

const RenderDirIndex = (req, res) => {
    res.send(DefaultPage(ReactDOMServer.renderToString(<App/>)));
}

export default [DirSecChecker, IsDir, DirExists, RenderDirIndex];

