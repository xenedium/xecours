import React from "react";
import ReactDOM from "react-dom";
import NavBar from "../components/NavBar";

export default function Err403(props){
    useEffect(() => {
        document.title = "403 - Forbidden";
    })
    return(
        <div>
            <NavBar />
            <h1>Error 403: {props.message}</h1>
        </div>
    );
}