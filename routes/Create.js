import db from '../utility/Database';
const { secret } = require('../config.json');
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


export default function Create (req, res, next) {

    const { username, password, email, first_name, last_name } = req.body;

    if ((!username || !password || !email || !first_name || !last_name)                         //missing fields
        || (username.length < 3 || password.length < 8 )                                        //invalid length
        || RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z-.]+$/).test(email) == false)         //invalid email
        {
        res.status(400).json({error: "Bad Request"});
        return;
    }

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results, fields) => {
        if (err) {res.status(500).json({error: "Internal Server Error"});return;}
        if (results.length != 0) {res.status(409).json({error: "Conflict : username already in use"});return;}
        
        db.query("INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)", 
            [username, crypto.createHash('sha256').update(password).digest('hex'), email, first_name, last_name], 
            (err, results, fields) => {
                if (err) res.status(500).json({error: "Internal Server Error"});
                else
                {
                    const token = jwt.sign({ username: username }, secret, { expiresIn: '72h' });
                    res.json({ token: token });
                }
                
            })
    })
}