import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    
    console.log(req.body);

    res.status(501).json({
        error: "Not implemented"
    });
}