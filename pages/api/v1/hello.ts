import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    res.send(await prisma.files.findMany());
}
