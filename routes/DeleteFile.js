const { secret } = require('../config.json');
import jwt from 'jsonwebtoken';
import fs from 'fs';
import db from '../utility/Database';


export default function DeleteFile(req, res, next) {
    const filepath = process.cwd() + '/public' + req.path.replace('api/v1/', '');
    if (!filepath) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }
    const { username } = jwt.verify(req.headers.authorization.split(" ")[1], secret);

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results, fields) => {
        if (err) res.status(500).json({ error: "Internal Server Error" });
        if (results[0].is_mod == 0) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        db.query("INSERT into deleted_files (path, username) VALUES (?, ?)", [filepath, username], (err, results, fields) => {
            if (err) res.status(500).json({ error: "Internal Server Error" });
            fs.unlink(filepath, (err) => {
                if (err) res.status(500).json({ error: "Internal Server Error : file not deleted" });
                res.json({ success: true });
            })
        }
        )
    })



}