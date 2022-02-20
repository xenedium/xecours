import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import NavBar from "../components/NavBar";


export default function DirectoryListing(props) {


    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userdata, setUserdata] = React.useState({});

    useEffect(() => {

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

    return (
        <div>
            <NavBar />

            {
                props.data.map((item, index) => {
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
        </div>

    );

}