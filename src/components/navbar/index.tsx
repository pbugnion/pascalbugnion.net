import * as React from "react"

import { Link } from "gatsby"

import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

import * as styles from "./index.module.css"

const NavbarInternalLink = ({ to, children }) => (
  <Nav.Link as={Link} to={to} className={styles.topNavLink}>{children}</Nav.Link>
)

export interface NavbarProps {
  containerAdditionalStyles: Array<string>
}

const SiteNavbar = ({ containerAdditionalStyles }: NavbarProps) => {
  return (
    <Navbar expand="md" variant="light" fixed="top" id={styles.topNavbar}>
      <Container className={containerAdditionalStyles.join(" ")}>
        <Navbar.Brand as={Link} to="/" className={styles.topNavbarBrand}>Pascal Bugnion</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-collapse-toggle" className={styles.topNavbarToggle} />
        <Navbar.Collapse id="basic-navbar-collapse-toggle">
          <Nav>
            <NavbarInternalLink to="/code">Code</NavbarInternalLink>
            <Nav.Link className={styles.topNavLink} href="http://scala4datascience.com">Book</Nav.Link>
            <NavbarInternalLink to="/notes">Digital Garden</NavbarInternalLink>
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
