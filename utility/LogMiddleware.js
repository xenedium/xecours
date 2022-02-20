export default function LogMiddleware(req, res, next) {         //TODO
    console.log("New request: " + req.method + " " + req.url);
    next();
}