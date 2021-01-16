import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

import styles from "./blog.module.css"

export default ({data}) => {
    return (
        <Layout>
            <div className={`container ${styles.articleContainer}`}>
                <header>
                    <div className="page-header">
                        <h1 className={styles.articleEntryTitle}>{data.markdownRemark.frontmatter.title}</h1>
                        <div className={styles.lastUpdatedDate}>
                            Last updated on the {data.markdownRemark.frontmatter.lastUpdatedDate}.
                        </div>
                    </div>
                </header>
                <main>
                    <div className={styles.articleEntryContent} dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
                </main>
            </div>
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