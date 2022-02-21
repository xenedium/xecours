import fs from 'fs';
import db from '../utility/Database';
import path from 'path';

export default function CreateDir(req, res) {
    const { username, is_mod } = req.user;

    if (!req.body.path) { res.status(400).json({ error: "Bad Request" }); return; }
    if (is_mod == 0) { res.status(401).json({ error: "Unauthorized : You need the mod role" }); return; }

    db.query("SELECT * FROM files WHERE path = ?", [req.body.path], (err, results, fields) => {
        if (err) { res.status(500).json({ error: "Internal Server Error" }); return; }
        if (results.length > 0) { res.status(400).json({ error: "Bad Request : Directory already exists" }); return; }

        db.query("INSERT into files (path, username) VALUES (?, ?)", [path.join(process.cwd(), 'public', req.body.path), username], (err, results, fields) => {
            if (err) { res.status(500).json({ error: "Internal Server Error" }); return; }
            fs.mkdirSync(path.join(process.cwd(), 'public', req.body.path));
            res.status(200).json({ success: true, message: "Directory created successfully" });
        })
    })


}