import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'
import { sign } from 'jsonwebtoken'
import { createHash } from 'crypto'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const secret = process.env.SECRET;

    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        res.status(405).send({
            error: 'Method not allowed'
        });
        return;
    }

    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({
            error: 'Please provide email and password'
        });
        return;
    }

    try
    {
        const user = await prisma.users.findFirst({
            where: {
                username: username,
                password: createHash('sha256').update(password).digest('hex')
            }
        });

        if (!user) {
            res.status(401).json({
                error: 'Invalid credentials'
            });
            return;
        }

        const token = sign({username: user.username}, secret, {expiresIn: '72h'});
        res.status(200).json({
            token: token
        });

    }
    catch (error)
    {
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }


}