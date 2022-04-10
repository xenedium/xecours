import type { NextApiRequest, NextApiResponse } from "next";
import type { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'
import { verify } from "jsonwebtoken";
import path from "path";
import { mkdir } from "fs/promises";


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

const CheckPath = (path: any, res: NextApiResponse) => {
    if (!path) {
        res.status(400).json({
            error: 'Bad request'
        });
        return false;
    }
    if (path.includes('..')) {
        res.status(403).json({
            error: 'Forbidden'
        });
        return false;
    }
    return true;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = await VerifyUser(req, res);
    if (!user) return;

    if (!CheckPath(req.body.path, res)) return;

    const filePath = path.join(process.cwd(), 'public', req.body.path);

    const dir = await prisma.files.findFirst({
        where: {
            path: filePath
        }
    })

    if (dir) {
        res.status(400).json({
            error: 'Directory already exists'
        });
        return;
    }

    await mkdir(filePath);

    await prisma.files.create({
        data: {
            path: filePath,
            username: user.username
        }
    })

    res.status(200).json({
        message: 'Directory created'
    });


}