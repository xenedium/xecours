import React from "react";
import Footer from "./Footer";
import Link from "next/link";
import Head from "next/head";

export default function Err404() {
    return (
        <>
            <Head>
                <title>404 - Not Found</title>
            </Head>
            <div className="d-flex flex-column min-vh-100">
                <div id="notfound">
                    <div className="notfound">
                        <div className="notfound-404">
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
        </>
    );
}