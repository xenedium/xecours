import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import NavBar from "../components/NavBar";

export default function Err404(props){
    useEffect(() => {
        document.title = "404 - Not Found";
    })
    return(
        <div>
            <NavBar />
            <h1>Error 404: {props.message}</h1>
        </div>
    );
}