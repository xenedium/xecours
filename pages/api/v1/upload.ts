import type { NextApiRequest, NextApiResponse } from "next"
import type { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.SECRET;

const DecodeToken = (token: string) => {
    try {
        return verify(token, SECRET) as string | JwtPayload | any;
    }
    catch {
        return null;
    }
}
const VerifyUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({
            error: 'Not signed in'
        });
        return null;
    }
    const decoded = DecodeToken(token);
    if (!decoded) {
        res.status(401).json({
            error: 'Not signed in'
        });
        return null;
    }
    try {
        const user = await prisma.users.findFirst({
            where: {
                username: decoded.username
            }
        })
        if (!user.is_mod) {
            res.status(403).json({
                error: 'Forbidden'
            });
            return null;
        }
        return user;
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
        console.error(error);
        return null;
    }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = await VerifyUser(req, res);
    if (!user) return;

    res.status(501).json({              //Not implemented
        error: 'Not implemented'
    });
}