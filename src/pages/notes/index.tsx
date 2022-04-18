import * as React from "react"
import { Helmet } from "react-helmet"

import { graphql, Link, navigate } from "gatsby"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import * as PageHeader from "../../components/page-header"
import NoteList from "../../components/note-list"

import * as styles from "./index.module.css"

export default ({ data }) => {
  const posts: Array<{ contentTitle: string, slug: string, lastUpdatedDate: string }> = data.allMdx.nodes.map(post => post.frontmatter)
  return (
    <Layout>
      <Helmet>
        <title>Data diversions | Pascal Bugnion's digital garden</title>
        <meta
          name="description"
          content="This is Pascal Bugnion's personal blog: a collection of notes on engineering leadership, programming, product management, and knowledge management."
        />
      </Helmet>
      <header>
        <Navbar containerAdditionalStyles={[styles.maxWidthContainer]} />
      </header>
      <main>
        <div className={`container content-container ${styles.maxWidthContainer}`}>
          <PageHeader.Container>
            <PageHeader.Title>Digital garden</PageHeader.Title>
            <PageHeader.Description>
              A collection of notes on engineering leadership, programming, product management, and knowledge management. Unlike a blog, I revisit notes as my thinking changes.
            </PageHeader.Description>
          </PageHeader.Container>
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
    allMdx(
      filter: {
        frontmatter: {
          onTOC: {
            eq: "yes"
          }
        },
      }
      sort: {
        fields: [frontmatter___lastUpdatedDate]
        order: DESC
      }
    ) {
      nodes {
        frontmatter {
          slug
          contentTitle
          lastUpdatedDate(formatString: "Do MMMM YYYY")
        }
      }
    }
  }
`
