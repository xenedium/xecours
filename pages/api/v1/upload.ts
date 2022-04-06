import type { NextApiRequest, NextApiResponse } from "next"
import type { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.SECRET;


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(400).json({
            error: 'Bad request'
        });
        return;
    }

    try {
        const decoded = verify(token, SECRET) as string | JwtPayload | any;

        const user = await prisma.users.findFirst({
            where: {
                username: decoded.username
            }
        });

        if (!user.is_mod) {
            res.status(403).json({
                error: 'Forbidden'
            });
            return;
        }

        res.status(501).json({              //Not implemented
            error: 'Not implemented'
        });

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }
}