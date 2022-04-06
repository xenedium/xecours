import type { NextApiRequest, NextApiResponse } from "next";
import type { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'
import { verify } from "jsonwebtoken";
import path from "path";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";


const prisma = new PrismaClient();
const SECRET = process.env.SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({
            error: 'Not signed in'
        });
        return;
    }


    try {

        const decoded = verify(token, SECRET) as string | JwtPayload | any;
        const user = await prisma.users.findFirst({
            where: {
                username: decoded.username
            }
        })

        if (!user.is_mod) {
            res.status(403).json({
                error: 'Forbidden'
            });
            return;
        }

        if (!req.body.path) {
            res.status(400).json({
                error: 'Bad request'
            });
            return;
        }

        if (req.body.path.includes('..')) {
            res.status(403).json({
                error: 'Forbidden'
            });
            return;
        }

        const filePath = path.join(process.cwd(), 'public', req.body.path);
        if (filePath.endsWith('/')) filePath.slice(0, -1);

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
                username: decoded.username
            }
        })

        res.status(200).json({
            message: 'Directory created'
        });

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }


}