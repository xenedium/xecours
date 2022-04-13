import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeftLong,
    faCode,
    faMugHot,
} from "@fortawesome/free-solid-svg-icons";
import { MagicSpinner } from "react-spinners-kit";
import Link from "next/link";
import Footer from "../components/Footer";
import Head from "next/head";

export default function Login() {
    useEffect(() => {
        if (window.localStorage.getItem("token")) {
            fetch("/api/v1/users/@me",
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": "Bearer " + window.localStorage.getItem("token")
                    }
                })
                .then(res => {
                    if (res.status == 200) window.location.href = "/";
                    else window.localStorage.removeItem("token");
                })
        }

        if (window.localStorage.getItem("theme") == "dark") { // handle the dark mode
        }
        else {
            if (!window.localStorage.getItem("theme")) window.localStorage.setItem("theme", "light");
            document.body.style.backgroundColor = "#f4f4f4";
        }

    }, [])

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const HandleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fetch("/api/v1/signin",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })
            .then(res => {
                if (res.status == 200) {
                    res.json().then(data => {
                        window.localStorage.setItem("token", data.token);
                        window.location.href = "/";
                    })
                }
                else {
                    res.json().then(data => { setError(data.error); });

                }
            })
    }

    const HandleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }
    const HandlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const Cooldown = () => {
        setTimeout(() => {
            setError(null);
        }, 4000);
        return ".";
    }


    return (
        <>
            <Head>
                <title>Login</title>
            </Head>

            <div className="d-flex flex-column min-vh-100">
                <Link href="/">
                    <a>
                        <button className="btn btn-secondary mt-2 ms-2" ><FontAwesomeIcon icon={faArrowLeftLong} width={20} height={20} /> Back to mainpage</button>
                    </a>
                </Link>
                <section className="h-100">
                    <div className="container h-100">
                        <div className="row justify-content-sm-center h-100">
                            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                                <div className="text-center my-5 d-flex flex-column align-content-center align-items-center">
                                    <MagicSpinner size={100} color="#000000" />
                                </div>
                                <div className="card shadow-lg">
                                    <div className="card-body p-5">
                                        <h1 className="fs-4 card-title fw-bold mb-4">Login</h1>
                                        <form method="POST" className="needs-validation" autoComplete="off">
                                            <div className="mb-3">
                                                <label className="mb-2 text-muted" htmlFor="username">Username</label>
                                                <input id="username" type="text" className="form-control" name="username" required autoFocus onChange={HandleUsernameChange} />
                                                <div className="invalid-feedback">
                                                    Username is invalid
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="mb-2 w-100">
                                                    <label className="text-muted" htmlFor="password">Password</label>
                                                </div>
                                                <input id="password" type="password" className="form-control" name="password" required onChange={HandlePasswordChange} />
                                                <div className="invalid-feedback">
                                                    Password is required
                                                </div>
                                            </div>
                                            <div className="alert alert-danger" role="alert" style={{ display: error ? "block" : "none" }} >
                                                {error ? error + Cooldown() : ""}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="form-check">
                                                    <input type="checkbox" name="remember" id="remember" className="form-check-input" defaultChecked={true} />
                                                    <label htmlFor="remember" className="form-check-label">Remember Me</label>
                                                </div>
                                                <button type="submit" className="btn btn-primary ms-auto" onClick={HandleLogin} >
                                                    Login
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer py-3 border-0">
                                        <div className="text-center">
                                            Don&apos;t have an account ?
                                            <Link href="/signup">
                                                <a className="text-dark ms-1">Create One</a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-5 text-muted">
                                    <FontAwesomeIcon icon={faCode} height={20} width={20} /> with <FontAwesomeIcon icon={faMugHot} height={20} width={20} /> By <a href="https://abderraziq.com" className="text-muted fw-bold">Sorrow</a> & <a href="https://Yahya-rabii.github.io" className="text-muted fw-bold">Yahya-rabii </a><br />
                                    Click on the names to visit our websites.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="mt-auto">
                    <Footer />
                </div>
            </div>
        </>
    )
}
