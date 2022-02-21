import db from '../utility/Database';
import path from 'path';

export default function Upload(req, res) {
    const { username, is_mod } = req.user;

    if (req.files) {

        if (is_mod == 0) { res.status(401).json({ error: "Unauthorized : You need the mod role" }); return; }

        if (req.files.files.length !== undefined) {
            let error = false;
            req.files.files.forEach(file => {
                file.mv(`${process.cwd()}/public${req.path.replace('/api/v1/upload', '')}${file.name}`);
                db.query("SELECT * from files where path = ?", [`${process.cwd()}/public${req.path.replace('/api/v1/upload', '')}${file.name}`], (err, results, fields) => {
                    if (err) error = true;
                    if (results.length == 0)
                        db.query("INSERT into files (path, username) VALUES (?, ?)", [`${process.cwd()}/public${req.path.replace('/api/v1/upload', '')}${file.name}`, username], (err, results, fields) => {
                            if (err) error = true;
                        });
                    else
                        db.query("UPDATE files SET username = ? WHERE path = ?", [username, `${process.cwd()}/public${req.path.replace('/api/v1/upload', '')}${file.name}`], (err, results, fields) => {
                            if (err) error = true;
                        });
                })
            });
            if (error) res.status(500).json({ error: "Internal Server Error" });
            else res.status(200).json({ success: true, message: "Files uploaded successfully" });
        }


        else {
            req.files.files.mv(`${process.cwd()}/public${req.path.replace('/api/v1/upload', '')}${req.files.files.name}`);
            db.query("SELECT * from files where path = ?", [`${process.cwd()}/public${req.path.replace('/api/v1/upload', '')}${req.files.files.name}`], (err, results, fields) => {
                let error = false;
                if (err) { res.status(500).json({ error: "Internal Server Error" }); return; }
                if (results.length == 0)
                    db.query("INSERT into files (path, username) VALUES (?, ?)", [`${process.cwd()}/public${req.path.replace('/api/v1/upload', '')}${req.files.files.name}`, username], (err, results, fields) => { if (err) error = true; });
                else
                    db.query("UPDATE files SET username = ? WHERE path = ?", [username, `${process.cwd()}/public${req.path.replace('/api/v1/upload', '')}${req.files.files.name}`], (err, results, fields) => { if (err) error = true; });

                if (error) res.status(500).json({ error: "Internal Server Error" });
                else res.status(200).json({ success: true, message: "Files uploaded successfully" });
            })
        }




    }
    else
        res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
}