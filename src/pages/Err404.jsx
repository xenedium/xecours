import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export default function Err404(props){
    useEffect(() => {
        document.title = "404 - Not Found";
    })
    return(
        <div>
            <h1>Error 404: {props.message}</h1>
        </div>
    );
}