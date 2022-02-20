import fs from 'fs';
import db from "../utility/Database";

const DirSecChecker = (req, res, next) => {
    if (req.path.includes("/.."))           //Illegal path, render the 403 forbidden page
        res.status(403).json({error: "Forbidden"});
    else next();
}

const IsDir = (req, res, next) => {
    if (!req.path.endsWith("/"))            //The client requested a non existing static file, render the 404 page
        res.status(404).json({error: "File Not Found"});
    else next();
}

const DirExists = (req, res, next) => {
    if (!fs.existsSync(process.cwd() + '/public' + req.path.replace('api/v1/', '')))   //The requested directory does not exist, render the 404 page
    res.status(404).json({error: "Directory Not Found"});
    else next();
}

const RenderDirIndex = (req, res) => {
    fs.readdir(process.cwd() + '/public' + req.path.replace('api/v1/', ''), (err, files) => {
        if (err) res.status(500).json({error: "Internal Server Error"});
        else
        {
            const data = [];
            files.forEach(file => {
                let fstat = fs.statSync(process.cwd() + '/public' + req.path.replace('api/v1/', '') + file);
                db.query("select us.username from users as us, files as fi where us.id = fi.user_id AND fi.path = ?", 
                    [process.cwd() + '/public' + req.path.replace('api/v1/', '') + file], 
                    (err, results, fields) => {
                        if (err) res.status(500).json({error: "Internal Server Error"});
                        data.push({
                            name: file,
                            type: fstat.isDirectory() ? "dir" : "file",
                            size: fstat.size,
                            lastModified: fstat.mtime,
                            author: results[0] ? results[0].username : "Unknown"
                        });
                        if (data.length == files.length) res.json(data);
                    })
                })
        }
    })
}

export default [DirSecChecker, IsDir, DirExists, RenderDirIndex];

