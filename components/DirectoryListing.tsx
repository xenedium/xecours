import React, { useEffect, useState } from "react";
import Err404 from "./Err404";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "./Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";

// TODO: FIX DROPDOWN / LOOK FOR A BETTER LOADER SVG / MORE UI FEATURES

interface FileInfo {
    name: string;
    type: string;
    size: number;
    lastModified: Date;
    author: string;
}

interface UserInfo {
    username: string;
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_mod: number;
}

export default function DirectoryListing() {

    const FetchFiles = async () => {
        fetch("/api/v1" + window.location.pathname)
            .then(res => {
                setApiResponseStatus(res.status);
                return res.json()
            })
            .then(data => {
                setFiles(data)
                setIsLoading(false)
            })
    }
    const VerifyUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch("/api/v1/users/@me", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                setUserInfo(data)
                setIsLoggedIn(true)
            }
            )
    }

    const router = useRouter();

    const [files, setFiles] = useState<FileInfo[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [apiResponseStatus, setApiResponseStatus] = useState<number>();

    const [path, setPath] = useState<string>("/");
    const [prevPath, setPrevPath] = useState<string>("/");


    useEffect(() => {
        FetchFiles();
        VerifyUser();
        setPath(router.asPath);
        setPrevPath(router.asPath.split("/").slice(0, -1).join("/"));
    }, [router]);


    const FormatSize = (size: number) => {
        if (size < 1024) return size + " B";
        else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
        else if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + " MB";
        else return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
    }
    const FormatDate = (date: Date) => {
        return new Date(date).toLocaleString();
    }

    const HandleDelete = (filepath: string) => {        //Need to alerts users that they don't have permission to delete
        if (!isLoggedIn) alert("You must be logged in to delete files");
        else {
            fetch("/api/v1" + filepath,
                {
                    method: "DELETE",
                    headers:
                    {
                        "Authorization": "Bearer " + window.localStorage.getItem("token")
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        window.location.reload();
                    }
                })
        }
    };
    const HandleFileUpload = (e) => {
        if (!isLoggedIn) alert("You must be logged in to delete files");
        else {
            e.preventDefault();
            let formData = new FormData();
            for (let i = 0; i < e.target.files.length; i++) {
                formData.append("files", e.target.files[i]);
            }
            fetch("/api/v1/upload" + window.location.pathname,
                {
                    method: "POST",
                    headers:
                    {
                        "Authorization": "Bearer " + window.localStorage.getItem("token")
                    },
                    body: formData
                })
                .then(res => {
                    if (res.status === 200) {
                        window.location.reload();
                    }
                })
        }
    };
    const HandleNewDir = (e) => {               //Need to alert users that they don't have permission to create new directories
        if (!isLoggedIn) alert("You must be logged in to delete files");
        else {
            const name = prompt("Enter the name of the new directory");
            if (name === null) return;
            fetch("/api/v1/createdir",
                {
                    method: "POST",
                    headers:
                    {
                        "Authorization": "Bearer " + window.localStorage.getItem("token"),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        path: path + name
                    })
                })
                .then(res => {
                    if (res.status === 200) {
                        window.location.reload();
                    }
                })
        }
    };

    if (apiResponseStatus === 404) return <Err404 />;
    else
        return (
            <>
                <Head>
                    <title>Directory Listing</title>
                </Head>
                <div className="container-fluid">
                    <div className="row flex-nowrap">
                        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                                <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                    <span className="fs-5 d-none d-sm-inline">Current path: {path}</span>
                                </a>
                                <hr />
                                <div className="dropdown pb-4">
                                    <a className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Image src="/profile_image.png" width="30" height="30" className="rounded-circle" alt="logo" />
                                        <span className="d-none d-sm-inline mx-1">{isLoggedIn ? userInfo.username : "Click here to sign in"}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                                        {
                                            /*
                                            <div>
                                                <li><a className="dropdown-item" href="#">New file</a></li>
                                                <li><a className="dropdown-item" href="#">Settings</a></li>
                                                <li><a className="dropdown-item" href="#">Profile</a></li>
                                                <li>
                                                    <hr className="dropdown-divider" />
                                                </li>
                                            </div>
                                            */
                                        }

                                        <li><a className="dropdown-item" onClick={() => {
                                            if (!isLoggedIn) window.location.href = "/login";
                                            else {
                                                localStorage.removeItem("token");
                                                setIsLoggedIn(false);
                                                window.location.reload();
                                            }
                                        }}>{isLoggedIn ? "Log out" : "Sign In"}</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col py-3 d-flex flex-column min-vh-100">
                            <div className="d-flex bd-highlight mb-3">
                                <Link href={prevPath} replace={true}>
                                    <a><button className="btn btn-dark me-auto p-2 bd-highlight"><FontAwesomeIcon icon={faLeftLong} width={20} height={20} /> Previous folder </button></a>
                                </Link>

                                <button className="btn btn-dark p-2 bd-highlight mx-2" onClick={HandleNewDir}><FontAwesomeIcon icon={faPlus} width={20} height={20} /> New Directory </button>
                                <button className="btn btn-dark p-2 bd-highlight" onClick={() => { document.getElementById("filebtn").click() }}><FontAwesomeIcon icon={faUpload} width={20} height={20} /> Upload File </button>
                                <input type="file" id="filebtn" multiple hidden onChange={HandleFileUpload} />
                            </div>

                            <table className="table table-striped table-hover">
                                <thead>

                                    <tr>
                                        <th>Name</th>
                                        <th>Size</th>
                                        <th>Uploaded On</th>
                                        <th>Uploaded By</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        files.length ?
                                            files.map((file, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            {
                                                                file.type === "dir" ?
                                                                    <Link href={`${path}/${file.name}`.replace("//", "/")}>
                                                                        <a>
                                                                            <button className={file.type === "dir" ? "btn btn-primary" : "btn btn-success"}>
                                                                                {file.name}
                                                                            </button>
                                                                        </a>
                                                                    </Link>
                                                                    :
                                                                    <a href={`${path}/${file.name}`.replace("//", "/")}>
                                                                        <button className={file.type === "dir" ? "btn btn-primary" : "btn btn-success"}>
                                                                            {file.name}
                                                                        </button>
                                                                    </a>
                                                            }

                                                        </td>
                                                        <td>
                                                            {file.type === "file" ? FormatSize(file.size) : "-"}
                                                        </td>
                                                        <td>
                                                            {FormatDate(file.lastModified)}
                                                        </td>
                                                        <td>
                                                            {file.author}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-danger" onClick={() => HandleDelete(path + file.name)}> Delete </button>
                                                        </td>
                                                    </tr>
                                                )
                                            }) : <></>
                                    }
                                </tbody>
                            </table>
                            {isLoading ? <Image src={"/three-dots.svg"} alt="" layout="fill" /> : <></>}
                            <div className="mt-auto">
                                <Footer />
                            </div>

                        </div>
                    </div>
                </div>

            </>

        );

}