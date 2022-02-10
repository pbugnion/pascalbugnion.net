import * as React from "react"

import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"

import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import * as PageHeader from "../../components/page-header"
import NoteList from "../../components/note-list"

import * as styles from "./index.module.css"
import * as pageStyles from "../../styles/page.module.css"

import type { NoteListProps } from "../../components/note-list"

const RelatedNotes = ({ relatedNotes }: NoteListProps) => (
  <div className={styles.relatedNotes}>
    <h2 className={styles.relatedNotesHeader}>Related notes</h2>
    <NoteList notes={relatedNotes} />
  </div>
)


const NotesAnchor = ({ href, ...props }) => {
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link data-link-internal to={href} {...props} />
  } else {
    return (
      <a
        data-link-external
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        {...props}
      />
    )
  }
}


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
  if (frontmatter.hasLatex) {
    import("katex/dist/katex.min.css")
    import("./katex-overrides.css")
  }
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
              <MDXProvider components={{ a: NotesAnchor }}>
                <MDXRenderer>{body}</MDXRenderer>
              </MDXProvider>
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
        hasLatex
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
