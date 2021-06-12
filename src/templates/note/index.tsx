import * as React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import PageHeader from "../../components/page-header"
import NoteList from "../../components/note-list"

import styles from "./index.module.css"
import pageStyles from "../../styles/page.module.css"

export default ({ data }) => {
  const {
    frontmatter,
    body,
    InboundReferences,
    OutboundReferences
  } = data.mdx
  const relatedNotes = []
  const existingSlugs = new Set<string>()
  InboundReferences.concat(OutboundReferences).forEach(({ frontmatter }) => {
    const { slug } = frontmatter
    if (!existingSlugs.has(slug)) {
      existingSlugs.add(slug)
      relatedNotes.push(frontmatter)
    }
  })
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
            <div className={styles.articleEntryContent}>
              <MDXRenderer>{body}</MDXRenderer>
            </div>
            <hr />
            <div className={styles.relatedNotes}>
              <h2 className={styles.relatedNotesHeader}>Related notes</h2>
              <NoteList notes={relatedNotes} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: {eq: $slug }}) {
      body
      frontmatter {
        contentTitle
      }
      InboundReferences {
        frontmatter {
          contentTitle
          slug
        }
      }
      OutboundReferences {
        frontmatter {
          contentTitle
          slug
        }
      }
    }
  }
`
