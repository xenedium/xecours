import React, { useEffect } from "react";
import Footer from "./Footer";
import Link from "next/link";

export default function Err404(props) {
    useEffect(() => {
        document.title = "404 - Not Found";
    })
    return (
        <div className="d-flex flex-column min-vh-100">
            <div id="notfound">
                <div class="notfound">
                    <div class="notfound-404">
                        <div></div>
                        <h1>404</h1>
                    </div>
                    <h2>Page not found</h2>
                    <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                    <Link href="/">
                    <   a>home page</a>
                    </Link>
                </div>
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>

    );
}