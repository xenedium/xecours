import express from "express";
import http from "http";
import https from "https";
import certs from "./certs/certs.js"
import GetHandlers from "./routes/GetHandlers.js";



// http app will be used to redirect http requests to https
const httpApp = express();

//default https app
const httpsApp = express();

httpApp.get("*", (req, res) => { //http to https redirect
    res.redirect("https://" + req.headers.host + req.url);
});


httpsApp.use(express.static("public")); //serve the public folder

httpsApp.get("*", GetHandlers); //serve the rest of the requests


if (process.env.DEBUG)
{
    const httpsServer = http.createServer(httpsApp).listen(8080);
}
else
{
    const httpServer = http.createServer(httpApp).listen(80);
    const httpsServer = https.createServer(httpsApp, certs).listen(443);
}

