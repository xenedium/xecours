import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";


export default function SignUp(props) {

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

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const HandleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const HandleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const HandleFirstnameChange = (e) => {
        setFirstname(e.target.value);
    }

    const HandleLastnameChange = (e) => {
        setLastname(e.target.value);
    }

    const HandlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const HandleSignUp = (e) => {
        e.preventDefault();
        fetch("/api/v1/create",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, username, first_name: firstname, last_name: lastname, password })
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


    const Cooldown = () => {
        setTimeout(() => {
            setError(null);
        }, 4000);
        return ".";
    }


    return (
        <div>
            <section className="h-100">
                <div className="container h-100">
                    <div className="row justify-content-sm-center h-100">
                        <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                            <div className="text-center my-5">
                                {/*<img src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg" alt="logo" width="100" />*/}
                            </div>
                            <div className="card shadow-lg">
                                <div className="card-body p-5">
                                    <h1 className="fs-4 card-title fw-bold mb-4">Sign Up</h1>
                                    <form className="needs-validation" noValidate="" autoComplete="off">
                                        <div className="mb-3">
                                            <label className="mb-2 text-muted" htmlFor="email">Email</label>
                                            <input id="email" type="email" className="form-control" name="email" required autoFocus onChange={HandleEmailChange} />
                                            <div className="invalid-feedback">
                                                Email is invalid
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="mb-2 text-muted" htmlFor="username">Username</label>
                                            <input id="username" type="text" className="form-control" name="username" required autoFocus onChange={HandleUsernameChange} />
                                            <div className="invalid-feedback">
                                                Username is invalid
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="mb-2 text-muted" htmlFor="firstname">First name</label>
                                            <input id="firstname" type="text" className="form-control" name="firstname" required autoFocus onChange={HandleFirstnameChange} />
                                            <div className="invalid-feedback">
                                                Firstname is invalid
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="mb-2 text-muted" htmlFor="email">Last name</label>
                                            <input id="lastname" type="text" className="form-control" name="lastname" required autoFocus onChange={HandleLastnameChange} />
                                            <div className="invalid-feedback">
                                                Lastname is invalid
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="text-muted" htmlFor="password">Password</label>
                                            <input id="password" type="password" className="form-control" name="password" required onChange={HandlePasswordChange} />
                                            <div className="invalid-feedback">
                                                Password is required
                                            </div>
                                        </div>
                                        <div className="alert alert-danger" role="alert" style={{ display: error ? "block" : "none" }} >
                                            {error ? error === "Bad Request" ? "Username must have 3 or more characters, Password must have 8 or more characters" + Cooldown() : error + Cooldown() : ""}
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <div className="form-check">
                                                <input type="checkbox" name="remember" id="remember" className="form-check-input" defaultChecked={true} />
                                                <label htmlFor="remember" className="form-check-label">Remember Me</label>
                                            </div>
                                            <button className="btn btn-primary ms-auto" onClick={HandleSignUp} >
                                                Sign up
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer py-3 border-0">
                                    <div className="text-center">
                                        Already have an account ? <a href="/login" className="text-dark">Log In</a>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-5 text-muted">
                                <i className="fa-solid fa-code"></i> with <i className="fa-solid fa-mug-hot"></i> By <a href="https://abderraziq.com" className="text-muted fw-bold">Sorrow</a> & <a href="https://github.com/Yahya-rabii" className="text-muted fw-bold">Yahya-rabii </a><br />
                                Click on the names to visit our websites.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="d-flex flex-wrap justify-content-evenly align-items-center py-3 my-4 border-top" style={{position: "absolute", bottom: "0px", width: '100%'}}>
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
    )
}