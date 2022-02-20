// lts-16.14.0
// npm v8.3.1


import express from "express";
import http from "http";
import https from "https";
import certs from "./certs/certs.js"
import GetHandlers from "./routes/GetHandlers.js";
import GetHandlersAPI from "./routes/GetHandlersAPI.js";
import LogMiddleware from "./utility/LogMiddleware.js";
import Login from "./routes/Login.js";
import UsersMe from './routes/UsersMe.js';
import Create from "./routes/Create.js";
import DeleteFile from "./routes/DeleteFile.js";
import VerifyToken from "./routes/VerifyToken.js";


// TODO: UPLOADING/COOLDOWN FOR CREATE/LOGIN


// http app will be used to redirect http requests to https
const httpApp = express();

//default https app
const httpsApp = express();

httpApp.get("*", (req, res) => { //http to https redirect
    res.redirect("https://" + req.headers.host + req.url);
});

httpsApp.use(express.json());
httpsApp.use([LogMiddleware, express.static("public", {index: false})]);    //LogMiddleware & express.static
httpsApp.use('/build', express.static('dist'));

httpsApp.get("/api/v1/users/@me", [VerifyToken, UsersMe]);          //UsersMe
httpsApp.get("/api/v1/*", GetHandlersAPI);                          //API for files and folders
httpsApp.get("*", GetHandlers);                                     //serve the pages get requests

httpsApp.post("/api/v1/login", Login);                              //Login
httpsApp.post("/api/v1/create", Create);                            //account creation

httpsApp.delete("/api/v1/*", [VerifyToken, DeleteFile]);            //DeleteFile

if (process.env.DEBUG)
{
    http.createServer(httpsApp).listen(8080);
}
else
{
    http.createServer(httpApp).listen(80);
    https.createServer(httpsApp, certs).listen(443);
}

