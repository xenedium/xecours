import React from "react";
import ReactDOM from "react-dom";
import NavBar from "../components/NavBar";


export default function DirectoryListing(props) {

    

    return (
        <div>
            <NavBar />
            {
                props.data.map(item => {
                    return (
                        <div key={item.id}>
                            <p>{item.name} - {item.type} - {item.size} - {item.lastModified} - {item.author}</p>
                        </div>
                    )
                })
            }
        </div>

    );

}