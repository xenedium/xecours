import fs from 'fs';
import db from '../utility/Database';


export default function DeleteFile(req, res, next) {
    const filepath = decodeURI(process.cwd() + '/public' + req.path.replace('api/v1/', ''));
    if (!filepath) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }
    const { username, is_mod } = req.user

    if (is_mod == 0) { res.status(401).json({ error: "Unauthorized : You need the mod role" }); return; }

    db.query("INSERT into deleted_files (path, username) VALUES (?, ?)", [filepath, username], (err, results, fields) => {
        if (err) {res.status(500).json({ error: "Internal Server Error" });return;}
        if (fs.statSync(filepath).isDirectory()) { res.status(400).json({ error: "Bad Request : Directories cannot be deleted yet" }); return; }
        fs.unlink(filepath, (err) => {
            if (err) { res.status(500).json({ error: "Internal Server Error : file not deleted" }); return; }
            db.query("DELETE FROM files WHERE path = ?", [filepath], (err, results, fields) => {
                if (err) res.status(500).json({ error: "Internal Server Error : but file was deleted" });
                else res.status(200).json({ success: true, message: "File deleted successfully" });
            })
        });

    })



}