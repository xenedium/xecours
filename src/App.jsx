import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import DirectoryListing from "./pages/DirectoryListing";
import Err403 from "./pages/Err403";
import Err404 from "./pages/Err404";

export default function App() {
    const [res, setRes] = React.useState([]);
    const [json, setJson] = React.useState([]);
    useEffect(() => {
        fetch("/api/v1" + window.location.pathname).then(resp => {
            setRes(resp);
            return resp.json();
        }).then(json => {
            setJson(json);
        })
    }, []);

    if (res.status === 403) return <Err403 message={json.error}/>;
    if (res.status === 404) return <Err404 message={json.error}/>;
    return <DirectoryListing data={json}/>;
}