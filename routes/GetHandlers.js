import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import DefaultPage from '../utility/DefaultPage';

import App from '../src/App';

const DirSecChecker = (req, res, next) => {
    if (req.path.includes("/.."))           //Illegal path, render the 403 forbidden page
        res.status(403).send("403 - Forbidden");
    else next();
}

const RenderDirIndex = (req, res) => {
    res.send(DefaultPage(ReactDOMServer.renderToString(<App/>)));
}

export default [DirSecChecker, RenderDirIndex];

