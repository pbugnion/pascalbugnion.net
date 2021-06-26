import * as React from "react"

import { graphql, Link, navigate } from "gatsby"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import PageHeader from "../../components/page-header"
import NoteList from "../../components/note-list"


import styles from "./index.module.css"

export default ({ data }) => {
  const posts: Array<{ contentTitle: string, slug: string }> = data.allMdx.nodes.map(post => post.frontmatter)
  return (
    <Layout>
      <header>
        <Navbar containerAdditionalStyles={[]} />
      </header>
      <main>
        <div className={`container content-container ${styles.maxWidthContainer}`}>
          <PageHeader>Digital garden</PageHeader>
          <p className={styles.explanationParagraph}>
            A collection of notes on topics that interest me, specially engineering leadership, programming, product management, and knowledge management. Unlike a blog, I revisit notes as my thinking changes.
          </p>
          <div>
            <NoteList notes={posts} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query BlogPostIndexQuery {
    allMdx(filter: {
      frontmatter: {
        onTOC: {
          eq: "yes"
        }
      }
    }) {
      nodes {
        frontmatter {
          slug
          contentTitle
        }
      }
    }
  }
`
