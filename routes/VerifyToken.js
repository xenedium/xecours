import jwt from 'jsonwebtoken';
const secret = require('../config.json').secret;

export default function VerifyToken(req, res, next){    
    if (!req.headers.authorization) {
        res.status(401).json({error: "Unauthorized"});
        return;
    }
    try
    {
        jwt.verify(req.headers.authorization.split(" ")[1], secret);
    }
    catch (err)
    {
        res.status(401).json({error: "Unauthorized"});
        return;
    }
    next();
}