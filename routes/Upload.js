import jwt from 'jsonwebtoken';
const secret = require('../config.json').secret;
import db from '../utility/Database';

export default function Upload (req, res) {
    const { username } = jwt.verify(req.headers.authorization.split(" ")[1], secret);

    if (req.files) {
        
        
        req.files.files.forEach(file => {
            file.mv(`${process.cwd()}/public${req.path.replace('api/v1/upload', '')}${file.name}`);
            db.query("INSERT into files (path, username) VALUES (?, ?)", [`${process.cwd()}/public${req.path.replace('api/v1/upload', '')}${file.name}`, username]);
        });

        res.json({
            success: true,
            message: "File uploaded successfully",
            data: req.files
        });

        return;
    }
    res.status(400).json({
        success: false,
        message: "No file uploaded"
    });
}