import jwt from 'jsonwebtoken';
const secret = require('../config.json').secret;
import db from '../utility/Database';

export default function UsersMe(req, res, next)
{
    const { username } = jwt.verify(req.headers.authorization.split(" ")[1], secret);
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results, fields) => {
        if (err) res.status(500).json({error: "Internal Server Error"});
        if (results.length == 0) res.status(401).json({error: "Unauthorized"});
        res.json({
            username: username,
            id: results[0].id,
            email: results[0].email,
            first_name: results[0].first_name,
            last_name: results[0].last_name,
            is_mod: results[0].is_mod
        });
    })
}