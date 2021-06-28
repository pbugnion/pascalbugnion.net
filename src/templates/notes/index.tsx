import * as React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import * as PageHeader from "../../components/page-header"
import NoteList from "../../components/note-list"

import styles from "./index.module.css"
import pageStyles from "../../styles/page.module.css"

import type { NoteListProps } from "../../components/note-list"

const RelatedNotes = ({ relatedNotes }: NoteListProps) => (
  <div className={styles.relatedNotes}>
    <h2 className={styles.relatedNotesHeader}>Related notes</h2>
    <NoteList notes={relatedNotes} />
  </div>
)


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
            <PageHeader.Container>
              <PageHeader.Title>
                {frontmatter.contentTitle}
              </PageHeader.Title>
            </PageHeader.Container>
            <div className={styles.lastUpdatedDate}>
              Last updated on {frontmatter.lastUpdatedDate}.
            </div>
            <div className={styles.articleEntryContent}>
              <MDXRenderer>{body}</MDXRenderer>
            </div>
            {relatedNotes.length > 0 && (
              <>
                <hr />
                <RelatedNotes relatedNotes={relatedNotes} />
              </>
            )}
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
        lastUpdatedDate(formatString: "Do MMMM YYYY")
      }
      InboundReferences {
        frontmatter {
          contentTitle
          slug
          lastUpdatedDate(formatString: "Do MMMM YYYY")
        }
      }
      OutboundReferences {
        frontmatter {
          contentTitle
          slug
          lastUpdatedDate(formatString: "Do MMMM YYYY")
        }
      }
    }
  }
`