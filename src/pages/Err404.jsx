import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import '../styles/404.css';

export default function Err404(props) {
    useEffect(() => {
        document.title = "404 - Not Found";
    })
    return (
        <div>
            <div id="notfound">
                <div class="notfound">
                    <div class="notfound-404">
                        <div></div>
                        <h1>404</h1>
                    </div>
                    <h2>Page not found</h2>
                    <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                    <a href="/">home page</a>
                </div>
            </div>
            <footer className="d-flex flex-wrap justify-content-evenly align-items-center py-3 my-4 border-top" style={{ position: "absolute", bottom: "0px", width: '100%' }}>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <div className="d-flex">
                        Ahmed Abderraziq
                    </div>
                    <ul className="nav col-md-4 list-unstyled d-flex">
                        <li className="ms-3"><a className="text-muted" href="https://abderraziq.com"><i className="fa-solid fa-globe"></i></a></li>
                        <li className="ms-3"><a className="text-muted" href="https://github.com/xenedium"><i className="fa-brands fa-github"></i></a></li>
                        <li className="ms-3"><a className="text-muted" href="https://github.com/xenedium"><i className="fa-brands fa-instagram"></i></a></li>
                    </ul>
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <div className="d-flex">
                        Yahya rabii
                    </div>
                    <ul className="nav col-md-4 list-unstyled d-flex">
                        <li className="ms-3"><a className="text-muted" href="https://github.com/Yahya-rabii"><i className="fa-solid fa-globe"></i></a></li>
                        <li className="ms-3"><a className="text-muted" href="https://github.com/Yahya-rabii"><i className="fa-brands fa-github"></i></a></li>
                        <li className="ms-3"><a className="text-muted" href="https://www.instagram.com/rabii_yahya/"><i className="fa-brands fa-instagram"></i></a></li>
                    </ul>
                </div>
            </footer>
        </div>

    );
}