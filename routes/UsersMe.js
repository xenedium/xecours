import db from '../utility/Database';

export default function UsersMe(req, res, next) {
    res.json({
        username: req.user.username,
        id: req.user.id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        is_mod: req.user.is_mod
    });
}