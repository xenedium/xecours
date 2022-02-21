import fs from 'fs';
import db from '../utility/Database';


export default function DeleteFile(req, res, next) {
   
    let filepath = decodeURI(process.cwd() + '/public' + req.path.replace('api/v1/', ''));
    if (filepath.endsWith('/')) {
        filepath = filepath.slice(0, -1);
    }
    if (filepath.includes("..")) {
        res.status(403).json({ error: "403 - Forbidden" });
        return;
    }

    if (!fs.existsSync(filepath)) {
        res.status(404).json({ error: "404 - Not Found" });
        return;
    }


    const { username, is_mod } = req.user

    if (is_mod == 0) { res.status(401).json({ error: "Unauthorized : You need the mod role" }); return; }

    db.query("INSERT into deleted_files (path, username) VALUES (?, ?)", [filepath, username], (err, results, fields) => {
        if (err) {res.status(500).json({ error: "Internal Server Error" });return;}
        if (fs.statSync(filepath).isDirectory()) {
            fs.rmSync(filepath, {recursive: true, force: true});
            db.query(`DELETE FROM files WHERE path LIKE '${filepath}%'`, (err, results, fields) => {
                if (err) {res.status(500).json({ error: "Internal Server Error" });return;}
                res.status(200).json({ success: true, message: "Directory deleted successfully" });
            })
        }
        else fs.rm(filepath, (err) => {
            if (err) { res.status(500).json({ error: "Internal Server Error : file not deleted" }); return; }
            db.query("DELETE FROM files WHERE path = ?", [filepath], (err, results, fields) => {
                if (err) res.status(500).json({ error: "Internal Server Error : but file was deleted" });
                else res.status(200).json({ success: true, message: "File deleted successfully" });
            })
        });

    })



}