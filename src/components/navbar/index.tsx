import * as React from "react"

import { Link } from "gatsby"

import styles from "./index.module.css"

export interface NavbarProps {
    containerAdditionalStyles: Array<string>
}

const Navbar = ({ containerAdditionalStyles }) => {
    return (
        <nav className={`navbar navbar-expand-md navbar-light fixed-top`} id={styles.topNavbar}>
            <div className={["container", ...containerAdditionalStyles].join(" ")}>
                <Link className="navbar-brand" to="/index.html">Pascal Bugnion</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar-navigation">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link to="/code" className="nav-link">Code</Link></li>
                        <li className="nav-item"><a href="http://www.scala4datascience.com" className="nav-link">Book</a></li>
                        <li className="nav-item"><Link to="/blog" className="nav-link">Blog</Link></li>
                        <li className="nav-item"><Link to="/contact" className="nav-link">About</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

Navbar.defaultProps = {
    containerAdditionalStyles: []
}

export default Navbar