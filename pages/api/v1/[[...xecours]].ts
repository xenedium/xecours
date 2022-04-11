import type { NextApiRequest, NextApiResponse } from "next"
import type { JwtPayload } from "jsonwebtoken";
import { Prisma, PrismaClient } from '@prisma/client'
import { readdir, rm, stat } from "fs/promises";
import { existsSync } from "fs";
import { verify } from "jsonwebtoken";
import path from "path";

const prisma = new PrismaClient();
const SECRET = process.env.SECRET;

enum FileType {
    File,
    Directory
}

const CheckPath = (reqUrl: string, path: string, res: NextApiResponse) => {
    if (reqUrl.includes('..')) {
        res.status(403).json({
            error: 'Forbidden'
        });
        return false;
    }
    if (!existsSync(path)) {
        res.status(404).json({
            error: 'Not found'
        });
        return false;
    }
    return true;
}

const DirectoryList = async (dirPath: string, res: NextApiResponse) => {             //Very slow avg 1350ms....
    try {
        const files = await readdir(dirPath);
        const data = [];
        for (let file of files) {
            let fstat = await stat(path.join(dirPath, file));
            const resFile = await prisma.files.findFirst({
                where: {
                    path: path.join(dirPath, file)
                }
            })
            data.push({
                name: file,
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
        console.error(error);
        return;
    }
}

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

const AddDeletedFile = async (delFile: string, username: string, res: NextApiResponse) => {
    try {
        return await prisma.deleted_files.create({
            data: {
                path: delFile,
                username: username
            }
        })
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
        console.error(error);
        return null;
    }
}

const HandleGet = async (req: NextApiRequest, res: NextApiResponse) => {
    const inPath = path.join(process.cwd(), '/public', req.url.replace("/api/v1", "/"));
    CheckPath(req.url, inPath, res) && await DirectoryList(inPath, res);           // Very slow avg 1350ms....
}

const DeleteAndRemove = async (fPath: string, res: NextApiResponse) => {
    try {
        if ((await stat(fPath)).isDirectory()) {
            await rm(fPath, { recursive: true, force: true });
            return RemoveDeletedFile(fPath, FileType.Directory, res);
        }
        else {
            await rm(fPath, { force: true });
            return RemoveDeletedFile(fPath, FileType.File, res);
        }
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
        console.error(error);
        return false;
    }
}

const RemoveDeletedFile = async (delFile: string, fType: FileType, res: NextApiResponse) => {
    try {
        if (fType === FileType.Directory) {
            await prisma.files.deleteMany({
                where: {
                    path: {
                        startsWith: delFile
                    }
                }
            })

        }
        else {
            await prisma.files.deleteMany({
                where: {
                    path: delFile
                }
            })
        }
        return true;
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
        console.error(error);
        return false;
    }
}

const HandleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await VerifyUser(req, res);
    if (!user) return;

    const filePath = decodeURI(path.join(process.cwd(), '/public', req.url.replace("/api/v1", "/")));

    if (!CheckPath(req.url, filePath, res)) return;

    const ress = await AddDeletedFile(filePath, user.username, res);
    if (!ress) return;

    if (!DeleteAndRemove(filePath, res)) return;

    res.status(200).json({
        message: 'Directory deleted'
    });


}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            await HandleGet(req, res);
            break;
        case 'DELETE':
            await HandleDelete(req, res);
            break;
        default:
            res.status(405).json({
                error: 'Method not allowed'
            });
            break;
    }

}
