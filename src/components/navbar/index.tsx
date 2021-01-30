import * as React from "react"

import { Link } from "gatsby"

import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

import styles from "./index.module.css"

export interface NavbarProps {
    containerAdditionalStyles: Array<string>
}

const SiteNavbar = ({ containerAdditionalStyles }) => {
    return (
        <Navbar expand="sm" variant="light" fixed="top" id={styles.topNavbar}>
            <Container className={containerAdditionalStyles.join(" ")}>
                <Navbar.Brand as={Link} to="/">Pascal Bugnion</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-collapse-toggle" />
                <Navbar.Collapse id="basic-navbar-collapse-toggle">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link to="/code" className="nav-link">Code</Link></li>
                        <li className="nav-item"><a href="http://www.scala4datascience.com" className="nav-link">Book</a></li>
                        <li className="nav-item"><Link to="/blog" className="nav-link">Blog</Link></li>
                        <li className="nav-item"><Link to="/contact" className="nav-link">About</Link></li>
                    </ul>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

SiteNavbar.defaultProps = {
    containerAdditionalStyles: []
}

export default SiteNavbar