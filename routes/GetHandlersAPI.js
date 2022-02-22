import fs from 'fs';
import db from "../utility/Database";

const DirSecChecker = (req, res, next) => {
    if (req.path.includes("/.."))           //Illegal path, render the 403 forbidden page
        res.status(403).json({ error: "Forbidden" });
    else next();
}

const DirExists = (req, res, next) => {
    if (!fs.existsSync(process.cwd() + '/public' + req.path.replace('api/v1/', '')))   //The requested directory does not exist, render the 404 page
        res.status(404).json({ error: "Directory or File Not Found" });
    else next();
}

const RenderDirIndex = (req, res) => {
    fs.readdir(process.cwd() + '/public' + req.path.replace('api/v1/', ''), (err, files) => {
        if (err) { res.status(500).json({ error: "Internal Server Error" }); return; }
        else {
            const data = [];
            if (files.length == 0) { res.status(200).json(data); return; }
            files.forEach(file => {
                let fstat = fs.statSync(process.cwd() + '/public' + req.path.replace('api/v1/', '') + file);
                db.query("select username from files where path = ?",
                    [process.cwd() + '/public' + req.path.replace('api/v1/', '') + file],
                    (err, results, fields) => {
                        if (err) {res.status(500).json({ error: "Internal Server Error" }); return;}
                        data.push({
                            name: file,
                            type: fstat.isDirectory() ? "dir" : "file",
                            size: fstat.size,
                            lastModified: fstat.mtime,
                            author: results[0] ? results[0].username : "Sorrow"
                        });
                        if (data.length == files.length) res.json(data);    // First time doing this workaround, I don't know why it works
                        // but it does, so I'm not going to touch it  ¯\_(ツ)_/¯
                        // I just hope it doesn't break anything or I'll have to fix it
                    })
            })
        }
    })
}

export default [DirSecChecker, DirExists, RenderDirIndex];

