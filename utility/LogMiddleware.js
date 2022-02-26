import fetch from "node-fetch";
const hookurl = require("../config.json").discordhook;
import db from "../utility/Database";

export default function LogMiddleware(req, res, next) {         //TODO

    fetch(hookurl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "LogMiddleware",
            content: `\`\`\`json\n${JSON.stringify({
                ip: req.ip.split(':')[3],
                method: req.method,
                url: req.url,
                headers: req.headers,
            })}\n\`\`\``
        })
    })
    db.query("INSERT INTO logs (ip, method, url, user_agent, referer, timestamp) VALUES (?, ?, ?, ?, ?, ?)", [req.ip.split(':')[3], req.method, req.url, req.headers["user-agent"], req.headers["referer"], Math.floor(new Date().getTime() / 1000)],
        (err, result) => {
            if (err) {
                console.log(err);
            }
        })




    next();
}