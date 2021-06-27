import * as React from "react"

import { Link } from "gatsby"

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import styles from "./landing/index.module.css"

const NavbarInternalLink = ({to, children}) => (
    <Nav.Link as={Link} to={to} className={styles.landingNavLink}>{children}</Nav.Link>
)

const LandingNavbar = () => {
    return (
        <Navbar expand="md" id={styles.landingNavbar} variant="dark">
            <Navbar.Brand as={Link} to="/" className={styles.landingNavbarBrand}>Pascal Bugnion</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-collapse-toggle-landing" className={styles.landingNavbarToggle} />
            <Navbar.Collapse id="landing-navbar-collapse-toggle-landing" className="justify-content-end">
                <Nav>
                    <NavbarInternalLink to="/code">Code</NavbarInternalLink>
                    <Nav.Link href="http://www.scala4datascience.com/" className={styles.landingNavLink}>Book</Nav.Link>
                    <NavbarInternalLink to="/notes">Digital Garden</NavbarInternalLink>
                    <NavbarInternalLink to="/contact">About</NavbarInternalLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default () => {
    return (
        <div className={styles.backgroundImage}>
            <div className={styles.contentContainer}>
                <div className={styles.inside}>
                    <LandingNavbar />
                    <div className={styles.topSpacer}></div>
                    <h1 className={styles.lead}>
                        Hi. I&#8217;m Pascal.
                    </h1>
                    <div className={styles.description}>
                        <p className={styles.descriptionParagraph}>
                            I'm a technical lead at <a href="https://faculty.ai">Faculty</a>. I build tools for data scientists.
                        </p>
                        <p className={styles.descriptionParagraph}>
                            This is my site. It has some information <Link to="/contact">about me</Link> and <Link to="/code">projects</Link> I work on, both at work in my spare time. 
                            I also sometimes <Link to="/blog">write</Link> about data science, software, and leading software teams.
                        </p>
                    </div>
                    <div className={styles.bottomSpacer}></div>
                </div>
            </div>
        </div>
    )
}
