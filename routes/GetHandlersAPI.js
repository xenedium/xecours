import fs from 'fs';

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

const RenderDirIndex = (req, res) => {          //TODO
    fs.readdir(process.cwd() + '/public' + req.path.replace('api/v1/', ''), (err, files) => {
        if (err) res.status(500).json({error: "Internal Server Error"});
        else
        {
            
        }
    })
}

export default [DirSecChecker, IsDir, DirExists, RenderDirIndex];

