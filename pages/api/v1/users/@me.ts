import type { NextApiRequest, NextApiResponse } from "next"
import type { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"
import { verify } from "jsonwebtoken";

const prima = new PrismaClient();
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

        const user = await prima.users.findFirst({
            where: {
                username: decoded.username
            }
        });

        res.status(200).json({
            username: user.username,
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_mod: user.is_mod
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }

}