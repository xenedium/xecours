import React, { useEffect } from "react";
import Err404 from "./Err404";

import Link from "next/link";
import Footer from "./Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faPlus, faUpload } from "@fortawesome/free-solid-svg-icons";

export default function DirectoryListing(props) {


    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [username, setUsername] = React.useState(null);
    const [fileData, setFileData] = React.useState([]);
    const [res, setRes] = React.useState(400);
    const [path, setPath] = React.useState("/");
    const [prevPath, setPrevPath] = React.useState("/");


    useEffect(() => {
        setPrevPath("/" + window.location.pathname.split("/").slice(0, -1).splice(1).toString());
        setPath(window.location.pathname);
        fetch("/api/v1" + window.location.pathname).then(res => {
            setRes(res);
            return res.json();
        }).then(json_data => {
            setFileData(json_data);
        })

        if (window.localStorage.getItem("token")) {
            fetch("/api/v1/users/@me",
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": "Bearer " + window.localStorage.getItem("token")
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(json => setUsername(json.username));
                        setIsLoggedIn(true);
                    }
                    else localStorage.removeItem("token");
                })
        }
    }, []);


    const FormatSize = (size) => {
        if (size < 1024) return size + " B";
        else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
        else if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + " MB";
        else return (size / 1024 / 1024 / 1024).toFixed(2) + " GB";
    }
    const FormatDate = (date) => {
        return new Date(date).toLocaleString();
    }

    const HandleDelete = (filepath) => {
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
    const HandleNewDir = (e) => {
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

    if (res.status === 404) return <Err404 />;
    else
        return (
            <div>
                <div className="container-fluid">
                    <div className="row flex-nowrap">
                        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                                <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                    <span className="fs-5 d-none d-sm-inline">Current path: {path}</span>
                                </a>
                                {/*
                                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                                        <li>
                                            <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle text-white dropdown-toggle">
                                                <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline ">My Uploaded files</span> </a>
                                            <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                                                {/*
                                                <div>
                                                    <li className="w-100">
                                                        <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 1 </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2 </a>
                                                    </li>
                                                </div>
                                                }

                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#submenu2" data-bs-toggle="collapse" className="nav-link px-0 align-middle text-white dropdown-toggle">
                                                <i className="fs-4 bi-bootstrap"></i> <span className="ms-1 d-none d-sm-inline">Pending Uploaded files</span></a>
                                            <ul className="collapse nav flex-column ms-1" id="submenu2" data-bs-parent="#menu">
                                                {/*
                                                <div>
                                                    <li className="w-100">
                                                        <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 1</a>
                                                    </li>
                                                    <li>
                                                        <a href="#" className="nav-link px-0"> <span className="d-none d-sm-inline">Item</span> 2</a>
                                                    </li>
                                                </div>
                                                }

                                            </ul>
                                        </li>
                                    </ul>*/
                                }
                                <hr />
                                <div className="dropdown pb-4">
                                    <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src="https://apexturbine.com/wp-content/uploads/2019/07/default_user_icon16-09-201474352760.png" alt="hugenerd" width="30" height="30" className="rounded-circle" />
                                        <span className="d-none d-sm-inline mx-1">{username ? username : "Click here to sign in"}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                                        {/*
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

                                        <li><a className="dropdown-item" href="#" onClick={() => {
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
                                        fileData.map((file, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <a href={`${path}/${file.name}`.replace("//", "/")}>
                                                            <button className={file.type === "dir" ? "btn btn-primary" : "btn btn-success"}>
                                                                {file.name}
                                                            </button>
                                                        </a>
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
                                        })

                                    }
                                </tbody>

                            </table>
                            <div className="mt-auto">
                                <Footer />
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        );

}