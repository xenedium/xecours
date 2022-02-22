import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import Err404 from "./Err404";


export default function DirectoryListing(props) {

    //if (props.error) return <Err404 message={props.error}/>;


    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userdata, setUserdata] = React.useState({});
    const [location, setLocation] = React.useState();
    const [data, setData] = React.useState([]);
    const [res, setRes] = React.useState([]);

    useEffect(() => {
        document.title = "Directory Listing";
        fetch("/api/v1" + window.location.pathname).then(resp => {
            setRes(resp);
            return resp.json();
        }).then(json => {
            setData(json);
        })

        if (window.localStorage.getItem("token"))
        {
            setIsLoggedIn(true);
            fetch("/api/v1/users/@me",
            {
                method: "GET",
                headers: 
                {
                    "Authorization": "Bearer " + window.localStorage.getItem("token")
                }
            })
            .then(res => res.json())
            .then(data => setUserdata(data));
        }
        setLocation(window.location.pathname);

    }, [])



    const Delete = (filepath) => {
        fetch("/api/v1" + filepath,
        {
            method: "DELETE",
            headers: 
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token")
            },
            
        })
        .then(res => res.json())
        .then(data => {
            if (data.success)
            {
                window.location.reload();
            }
        })
    }

    const [files, setFiles] = React.useState([]);

    const HandleChange = (e) => {
        setFiles(e.target.files);
    }

    const HandleFileSubmission = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let i = 0; i < files.length; i++)
        {
            formData.append("files", files[i]);
        }
        fetch("/api/v1/upload" + location,
        {
            method: "POST",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token")
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success)
            {
                window.location.reload();
            }
        })
    }

    if (res.status === 404) return <Err404 message="404: Not Found" />;
    else 
    return (
        <div>

            {
                data.map((item, index) => {
                    return (
                        <div key={index}>
                            <p>
                                {item.name} - {item.type} - {item.size} - {item.lastModified} - {item.author}
                                <button onClick={() => { Delete(window.location.pathname + item.name) }} disabled={!isLoggedIn}>Delete this file</button>
                            </p>
                        </div>
                    )
                })
            }

            <form action={"/api/v1/upload" + location} method="POST" encType="multipart/form-data">
                <input onChange={HandleChange} type="file" name="file" multiple />
                <button onClick={HandleFileSubmission}>Upload</button>
            </form>
        </div>

    );

}