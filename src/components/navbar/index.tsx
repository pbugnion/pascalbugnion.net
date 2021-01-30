import * as React from "react"

import { Link } from "gatsby"

import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

import styles from "./index.module.css"

const NavbarInternalLink = ({to, children}) => (
    <Nav.Link as={Link} to={to}>{children}</Nav.Link>
)

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
                    <Nav>
                        <NavbarInternalLink to="/code">Code</NavbarInternalLink>
                        <Nav.Link>Book</Nav.Link>
                        <NavbarInternalLink to="/blog">Blog</NavbarInternalLink>
                        <NavbarInternalLink to="/contact">About</NavbarInternalLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

SiteNavbar.defaultProps = {
    containerAdditionalStyles: []
}

export default SiteNavbar