import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import DirectoryListing from "./pages/DirectoryListing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";


export default function App() {

    const [path, setPath] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        setPath(window.location.pathname);
        setLoading(false);
    }, [])

    if (loading) return <div>Loading...</div>;
    else
    {
        if (path === "/login" || path === "/login/") return <Login />;
        else if (path === "/signup" || path === "/signup/" ) return <SignUp />;
        else return <DirectoryListing />;
    }
    
}