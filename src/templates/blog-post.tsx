import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

import styles from "./blog.module.css"

export default ({ data }) => {
    return (
        <Layout>
            <header>
                <nav className="navbar navbar-expand-md navbar-light fixed-top" id="top-navbar">
                    <div className={`container ${styles.blogNavbarContainer}`}>
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
                <div className={`container ${styles.articleContainer}`}>
                    <div className="page-header">
                        <h1 className={styles.articleEntryTitle}>{data.markdownRemark.frontmatter.title}</h1>
                    </div>
                    <div className={styles.lastUpdatedDate}>
                        Last updated on the {data.markdownRemark.frontmatter.lastUpdatedDate}.
                        </div>
                    <div className={styles.articleEntryContent} dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
                </div>
            </main>
        </Layout>
    )
}

export const query = graphql`
  query($slug: String!) {
      markdownRemark(frontmatter: { slug: {eq: $slug }}) {
          html
          frontmatter {
              title
              lastUpdatedDate(formatString: "Do MMMM YYYY")
          }
      }
  }
`