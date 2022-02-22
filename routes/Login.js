import jwt from 'jsonwebtoken';
const { secret } = require('../config.json');
import db from '../utility/Database';
import crypto from 'crypto';

export default function Login (req, res) {
    const { username, password } = req.body;
    if (!username || !password) {res.status(400).json({ error: "Bad Request" });return;}
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", 
        [username, crypto.createHash('sha256').update(password).digest('hex')], 
        (err, results, fields) => {
            if (err) {res.status(500).json({error: "Internal Server Error"});return;}
            if (results.length == 0) res.status(401).json({error: "Unauthorized"});
            
            const token = jwt.sign({ username: username }, secret, { expiresIn: '72h' });
            res.json({ token: token });
            
        })
}