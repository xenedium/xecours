// lts-16.14.0
// npm v8.3.1


import express from "express";
import http from "http";
import https from "https";
import certs from "./certs/certs.js"
import GetHandlers from "./routes/GetHandlers.js";
import GetHandlersAPI from "./routes/GetHandlersAPI.js";
import LogMiddleware from "./utility/LogMiddleware.js";


// TODO: LOGGING/FILE LISTING WITH DETAILS/UPLOADING/DELETING


// http app will be used to redirect http requests to https
const httpApp = express();

//default https app
const httpsApp = express();

httpApp.get("*", (req, res) => { //http to https redirect
    res.redirect("https://" + req.headers.host + req.url);
});

httpsApp.use([LogMiddleware, express.static("public", {index: false})]);    //LogMiddleware & express.static
httpsApp.use('/build', express.static('dist'));

httpsApp.get("/api/v1/*", GetHandlersAPI);
httpsApp.get("*", GetHandlers); //serve the rest of the get requests


if (process.env.DEBUG)
{
    http.createServer(httpsApp).listen(8080);
}
else
{
    http.createServer(httpApp).listen(80);
    https.createServer(httpsApp, certs).listen(443);
}

