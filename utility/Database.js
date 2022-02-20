const mysql = require('mysql');
const config = require('../config.json');

const connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});


connection.connect();

export default connection;