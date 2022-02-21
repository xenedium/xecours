import jwt from 'jsonwebtoken';
const secret = require('../config.json').secret;
import db from '../utility/Database';

export default function VerifyToken(req, res, next){
    let decoded;
    if (!req.headers.authorization) {
        res.status(401).json({error: "Not signed in"});
        return;
    }
    try
    {
        decoded = jwt.verify(req.headers.authorization.split(" ")[1], secret);
    }
    catch (err)
    {
        res.status(401).json({error: "Unauthorized"});
        return;
    }
    db.query("SELECT * FROM users WHERE username = ?", [decoded.username], (err, results, fields) => {
        if (err) {res.status(500).json({error: "Internal Server Error"});return;}
        if (results.length == 0) {res.status(401).json({error: "Invalid token"});return;}
        req.user = results[0];
        next();
    })
}