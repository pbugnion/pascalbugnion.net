import * as React from "react"
import rot13 from "../../services/rot-13"
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import Layout from "../../components/layout"

import headshot from "./images/Headshot-Pascal-1.jpg"
import mailIcon from "./images/mail-icon.png"
import linkedInIcon from "./images/linkedin-icon.png"
import githubIcon from "./images/github-icon.png"
import twitterIcon from "./images/twitter-icon.png"
import stackOverflowIcon from "./images/stackoverflow-icon.png"

import styles from "./index.module.css"

const ContactEntryLink = ({ iconContent, href, title, value }) => {
  return (
    <p className={styles.contactRow}>
      <OverlayTrigger
        key="title"
        placement="top"
        overlay={<Tooltip id={`tooltip-${title}`}>{title}</Tooltip>}
      >
        {({ ref, ...triggerHandler }) => (
          <>
            <span className={styles.contactKey} {...triggerHandler}>
              <img src={iconContent} height="36" width="36" alt={title} />
            </span>
            <a href={href} ref={ref} {...triggerHandler}>
              {value}
            </a>
          </>
        )}
      </OverlayTrigger>
    </p>
  );
}

const ContactEntryEmail = () => {
  const email = rot13("cnfpny@ohtavba.bet")
  const href = `mailto:${email}`
  return (
    <ContactEntryLink iconContent={mailIcon} href={href} title="email" value={email} />
  )
}

// styles
const IndexPage = () => {
  return (
    <Layout>
      <header>
        <nav className="navbar navbar-expand-md navbar-light fixed-top" id="top-navbar">
          <div className={`container ${styles.maxWidthContainer}`}>
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
      </header>
      <main>
        <div className={`container content-container ${styles.maxWidthContainer}`}>
          <div className="page-header">
            <h1>About me</h1>
          </div>
          <div className="row">
            <div className={`col-md-7 col-lg-8 ${styles.contactText}`}>
              <p>
                I am a software engineering technical lead.
              </p>
              <p>
                I build tools for data science and machine learning. I live in London and work at <a href="https://faculty.ai/">Faculty</a>, as part of the <a href="https://faculty.ai/products-services/platform/">Faculty Platform</a> team.
              </p>
              <p>
                Outside of my day job, I am a contributor to open source, specially in the Jupyter and Plotly ecosystems. I am a core contributor to <a href="https://jupyter.org/widgets">Jupyter widgets</a> and the main author of <a href="/code.html">several Python libraries</a>.
              </p>
              <p>
                I hold a PhD from Cambridge University in <a href="https://www.tcm.phy.cam.ac.uk/people/staff.html">theoretical solid state physics</a>, working on <a href="https://en.wikipedia.org/wiki/Quantum_Monte_Carlo">quantum Monte Carlo</a> methods.
              </p>
            </div>
            <div className={`col-md-5 col-lg-4 order-first order-md-last ${styles.headshotImgContainer}`}>
              <img src={headshot} alt="Pascal Bugnion" width="100%" />
            </div>
          </div>
          <div className={`row ${styles.contactLinksRow}`}>
            <div className="col-md-7 col-lg-8">
              <ContactEntryEmail />
              <ContactEntryLink iconContent={linkedInIcon} title="LinkedIn" href="https://uk.linkedin.com/in/pbugnion" value="pbugnion" />
              <ContactEntryLink iconContent={githubIcon} title="GitHub" href="https://github.com/pbugnion" value="pbugnion" />
            </div>
            <div className="col-md-5 col-lg-3">
              <ContactEntryLink iconContent={twitterIcon} title="Twitter" href="https://twitter.com/pascalbugnion" value="@pascalbugnion" />
              <ContactEntryLink iconContent={stackOverflowIcon} title="Stack Overflow" href="https://stackoverflow.com/users/827862/pascal-bugnion" value="pascal-bugnion" />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
