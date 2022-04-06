import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'
import { sign } from 'jsonwebtoken'
import { createHash } from 'crypto'

const prisma = new PrismaClient();
const secret = process.env.SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { username, password, email, first_name, last_name } = req.body;

    if (!username || !password || !email || !first_name || !last_name) {
        res.status(400).json({
            error: 'Bad request'
        });
        return;
    }

    if (username.length < 3 || password.length < 3) {
        res.status(400).json({
            error: 'Username and password must be at least 3 characters long'
        });
        return;
    }

    if (RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/).test(email) === false) {
        res.status(400).json({
            error: 'Invalid email'
        });
        return;
    }

    try {
        const user = await prisma.users.findFirst({
            where: {
                username: username
            }
        });

        if (user) {
            res.status(400).json({
                error: 'Username already exists'
            });
            return;
        }

        const newUser = await prisma.users.create({
            data: {
                username: username,
                password: createHash('sha256').update(password).digest('hex'),
                email: email,
                first_name: first_name,
                last_name: last_name
            }
        });

        const token = sign({ username: newUser.username }, secret, { expiresIn: '72h' });
        res.status(200).json({
            token: token
        });

    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }
}