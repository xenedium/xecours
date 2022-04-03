import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGlobe
} from "@fortawesome/free-solid-svg-icons";
import {
    faGithub,
    faInstagram
} from "@fortawesome/free-brands-svg-icons";


export default function Footer() {
    return (
        <>
            <footer className="d-flex flex-wrap justify-content-evenly align-items-center py-3 my-4 border-top" style={{}}>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <div className="d-flex">
                        Ahmed Abderraziq
                    </div>
                    <ul className="nav col-md-4 list-unstyled d-flex">
                        <li className="ms-3"><a className="text-muted" href="https://abderraziq.com"><FontAwesomeIcon icon={faGlobe} height={20} width={20} /></a></li>
                        <li className="ms-3"><a className="text-muted" href="https://github.com/xenedium"><FontAwesomeIcon icon={faGithub} height={20} width={20} /></a></li>
                        <li className="ms-3"><a className="text-muted" href="https://github.com/xenedium"><FontAwesomeIcon icon={faInstagram} height={20} width={20} /></a></li>
                    </ul>
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <div className="d-flex">
                        Yahya rabii
                    </div>
                    <ul className="nav col-md-4 list-unstyled d-flex">
                        <li className="ms-3"><a className="text-muted" href="https://Yahya-rabii.github.io"><FontAwesomeIcon icon={faGlobe} height={20} width={20} /></a></li>
                        <li className="ms-3"><a className="text-muted" href="https://github.com/Yahya-rabii"><FontAwesomeIcon icon={faGithub} height={20} width={20} /></a></li>
                        <li className="ms-3"><a className="text-muted" href="https://www.instagram.com/rabii_yahya/"><FontAwesomeIcon icon={faInstagram} height={20} width={20} /></a></li>
                    </ul>
                </div>
            </footer>
        </>
    );
}
