import * as React from "react"

export interface NavbarProps {
    containerAdditionalStyles: Array<string>
}

const Navbar = ({ containerAdditionalStyles }) => {
    return (
        <nav className="navbar navbar-expand-md navbar-light fixed-top" id="top-navbar">
            <div className={["container", ...containerAdditionalStyles].join(" ")}>
                <a className="navbar-brand" href="/index.html">Pascal Bugnion</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar-navigation">
                    <ul className="navbar-nav">
                        <li className="nav-item"><a href="code.html" className="nav-link">Code</a></li>
                        <li className="nav-item"><a href="talks.html" className="nav-link">Talks</a></li>
                        <li className="nav-item"><a href="http://www.scala4datascience.com" className="nav-link">Book</a></li>
                        <li className="nav-item"><a href="blog/index.html" className="nav-link">Blog</a></li>
                        <li className="nav-item active"><a href="#" className="nav-link">About</a></li>
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