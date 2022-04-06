import type { NextApiRequest, NextApiResponse } from "next"
import type { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'
import { readdir, rm, stat } from "fs/promises";
import { existsSync } from "fs";
import { verify } from "jsonwebtoken";
import path from "path";

const prisma = new PrismaClient();
const SECRET = process.env.SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        if (req.url.includes("/..")) {
            res.status(403).json({
                error: 'Forbidden'
            });
            return;
        }

        if (!existsSync(path.join(process.cwd(), '/public', req.url.replace("/api/v1", "/")))) {
            res.status(404).json({
                error: 'Not found'
            });
            return;
        }


        try {
            const files = await readdir(path.join(process.cwd(), '/public', req.url.replace("/api/v1", "/")), { withFileTypes: true })
            const data = [];
            for (let file of files) {
                let fstat = await stat(path.join(process.cwd(), '/public', req.url.replace("/api/v1", "/"), file.name));
                const resFile = await prisma.files.findFirst({
                    where: {
                        path: path.join(process.cwd(), '/public', req.url.replace("/api/v1", ""), file.name)
                    }
                })
                data.push({
                    name: file.name,
                    type: fstat.isDirectory() ? 'dir' : 'file',
                    size: fstat.size,
                    lastModified: fstat.mtime,
                    author: resFile?.username ? resFile.username : 'Xe'
                })
            }

            res.json(data);
        }
        catch (error) {
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
    else if (req.method === 'DELETE') {

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
            });

            if (!user.is_mod) {
                res.status(403).json({
                    error: 'Forbidden'
                });
                return;
            }

            const filePath = decodeURI(path.join(process.cwd(), '/public', req.url.replace("/api/v1", "/")));

            if (filePath.endsWith('/')) filePath.slice(0, -1);

            if (req.url.includes("/..")) {
                res.status(403).json({
                    error: 'Forbidden'
                });
                return;
            }

            if (!existsSync(filePath)) {
                res.status(404).json({
                    error: 'Not found'
                });
                return;
            }

            const dl_file = await prisma.deleted_files.create({         //Issue here
                data: {
                    path: filePath,
                    username: user.username
                }
            })

            if ((await stat(filePath)).isDirectory()) {
                await rm(filePath, { recursive: true, force: true });
                await prisma.deleted_files.deleteMany({                 //Issue here
                    where: {
                        path: {
                            contains: filePath
                        }
                    }
                });
                res.status(200).json({
                    message: 'Directory deleted'
                });
            }
            else {
                await rm(filePath, { force: true });
                await prisma.deleted_files.deleteMany({                 //Issue here
                    where: {
                        path: filePath
                    }
                });
                res.status(200).json({
                    message: 'File deleted'
                });
            }
        }
        catch (error) {
            res.status(500).json({
                error: 'Internal server error'
            });
            console.log(error);
        }

    }
}
