import React, { useEffect, useState } from "react";
import Err404 from "./Err404";
import { join } from "path";
import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "./Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLeftLong, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";
import { ClapSpinner } from "react-spinners-kit";
import { DropdownButton, Alert, Dropdown } from "react-bootstrap"


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

// TODO: IMPLEMENT UPLOAD 

export default function DirectoryListing() {

    const FetchFiles = async () => {
        fetch("/api/v1" + window.location.pathname )
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
    const ClearToken = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserInfo(null);
    }
    const ShowAlert = (message: string, alertType: string) => {
        setAlertMessage(message);
        setAlertVariant(alertType);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    }


    const router = useRouter();

    const [files, setFiles] = useState<FileInfo[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [apiResponseStatus, setApiResponseStatus] = useState<number>();

    const [path, setPath] = useState<string>("/");

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertVariant, setAlertVariant] = useState<string>("danger");
    const [alertMessage, setAlertMessage] = useState<string>("You do not have enough permissions to do this action !");

    useEffect(() => {
        FetchFiles();
        VerifyUser();
        setPath(router.asPath);
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
    const HandleDelete = (filepath: string) => {
        if (!isLoggedIn) ShowAlert("You need to be logged in to delete files !", "danger");
        else if (!userInfo.is_mod) ShowAlert("You need to be a moderator to delete files !", "danger");
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
                    else {
                        ShowAlert("An error occured while deleting the file !", "danger");
                    }
                })
        }
    };
    const HandleFileUpload = (e: any) => {
        if (!isLoggedIn) ShowAlert("You need to be logged in to upload files !", "danger");
        else if (!userInfo.is_mod) ShowAlert("You need to be a moderator to upload files !", "danger");
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
                    else {
                        ShowAlert("An error occured while uploading files !", "danger");
                    }
                })
        }
    };
    const HandleNewDir = (e: any) => {
        if (!isLoggedIn) ShowAlert("You must be logged in to create new directories", "danger");
        else if (!userInfo.is_mod) ShowAlert("You do not have enough permissions to do this action !", "danger");
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
                        path: join(path, name)
                    })
                })
                .then(res => {
                    if (res.status === 200) {
                        window.location.reload();
                    }
                    else {
                        ShowAlert("An error occured while creating the directory !", "danger");
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
                <Alert show={showAlert} variant={alertVariant} onClick={() => setShowAlert(false)} dismissible className="fixed-top align-items-center d-flex flex-column opacity-75">
                    <Alert.Heading>{alertMessage}</Alert.Heading>
                </Alert>
                <div className="container-fluid">
                    <div className="row flex-nowrap">
                        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                                <span className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                    <span className="fs-5 d-none d-sm-inline">Current path: {path}</span>
                                </span>
                                <hr />
                                <DropdownButton title={<><FontAwesomeIcon icon={faUser} width={14} height={16} /><span className="d-none d-sm-inline mx-3">{isLoading ? "Loading..." : isLoggedIn ? userInfo.username : "Not logged In"}</span></>}>
                                    <Dropdown.Item onClick={() => {
                                        if (isLoggedIn) {
                                            ClearToken();
                                            ShowAlert("Successfully logged out !", "warning");
                                        }
                                        else router.push("/signin")
                                    }}>
                                        <span>
                                            {isLoggedIn ? "Log out" : "Log In"}
                                        </span>
                                    </Dropdown.Item>
                                </DropdownButton>

                            </div>
                        </div>
                        <div className="col py-3 d-flex flex-column min-vh-100">
                            <div className="d-flex bd-highlight mb-3">
                                <span onClick={() => {
                                    if (path === "/") return;
                                    setIsLoading(true);
                                    router.back();
                                }}><button className="btn btn-dark me-auto p-2 bd-highlight"><FontAwesomeIcon icon={faLeftLong} width={20} height={20} /> Previous folder </button></span>


                                <button className="btn btn-dark p-2 bd-highlight mx-2" onClick={HandleNewDir}><FontAwesomeIcon icon={faPlus} width={20} height={20} /> New Directory </button>
                                <button className="btn btn-dark p-2 bd-highlight" onClick={() => {
                                    if (!isLoggedIn) ShowAlert("You must be logged in to upload files !", "danger");
                                    else if (!userInfo.is_mod) ShowAlert("You do not have enough permissions to do this action !", "danger");
                                    else document.getElementById("filebtn").click()
                                }}><FontAwesomeIcon icon={faUpload} width={20} height={20} /> Upload File </button>
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
                                        !isLoading ?
                                        files.length ?
                                            files.map((file, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            {
                                                                file.type === "dir" ?
                                                                    <button className={file.type === "dir" ? "btn btn-primary" : "btn btn-success"} onClick={() => {
                                                                        setIsLoading(true)
                                                                        router.push(`${path}/${file.name}`.replace("//", "/"))
                                                                    }}>
                                                                        {file.name}
                                                                    </button>
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
                                            }) : <></> : <></>
                                    }
                                </tbody>
                            </table>
                            {isLoading ? <div className="d-flex flex-column align-content-center align-items-center"><ClapSpinner size={100}/></div> : <></>}
                            <div className="mt-auto">
                                <Footer />
                            </div>

                        </div>
                    </div>
                </div>

            </>

        );

}