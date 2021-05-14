import * as React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import PageHeader from "../../components/page-header"

import styles from "./index.module.css"
import pageStyles from "../../styles/page.module.css"

export default ({ data }) => {
  const { frontmatter, html } = data.markdownRemark
  return (
    <Layout>
      <Helmet>
        <title>{frontmatter.contentTitle}</title>
        <meta name="description" content={frontmatter.contentTitle} />
      </Helmet>
      <header>
        <Navbar containerAdditionalStyles={[styles.blogNavbarContainer]} />
      </header>
      <main>
        <div className={styles.bodyContainer}>
          <div className={`container ${styles.articleContainer}`}>
            <PageHeader>{frontmatter.contentTitle}</PageHeader>
            <div className={styles.lastUpdatedDate}>
              Last updated on the 21st January 2021.
            </div>
            <div className={styles.articleEntryContent} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
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
        contentTitle
      }
    }
  }
`
