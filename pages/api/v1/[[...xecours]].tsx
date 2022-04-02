import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'

import { readdir, stat } from "fs/promises";
import path from "path";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    try {
        const files = await readdir(path.join(process.cwd(), '/public', req.url.replace("/api/v1", "/")), { withFileTypes: true })
        const data = []
        for (let file of files) {
            let fstat = await stat(path.join(process.cwd(), '/public', req.url.replace("/api/v1", "/"), file.name));
            if (file.isDirectory()) data.push({ name: file.name, type: 'dir', size: fstat.size, lastModified: fstat.mtime, author: 'Xe'});
            else data.push({ name: file.name, type: 'file', size: fstat.size, lastModified: fstat.mtime, author: 'Xe' })
        }
    
        res.json(data);
    }
    catch (e) {
        res.status(404).json({ error: 'Not found' })
    }
    
}
