import * as React from "react"

import { graphql, Link, navigate } from "gatsby"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import PageHeader from "../../components/page-header"

import TreeIcon from "./TreeIcon"

import styles from "./index.module.css"

const PostCard = ({ post }) => {
  const { contentTitle, slug } = post
  return (
    <li>
      <article className={styles.postCard} onClick={() => navigate(slug)}>
        <TreeIcon />
        <div className={styles.cardBodyContainer}>
          <header>
            <h2 className={styles.postCardTitle}>
              {/* Keep a link for semantics and to encourage Gatsby to
                  preload assets at that link */}
              <Link to={slug}>{contentTitle}</Link>
            </h2>
          </header>
          <footer>
            <abbr className={styles.postCardDate}>Last modified 10th January 2021</abbr>
          </footer>
        </div>
      </article>
    </li>
  )
}

export default ({ data }) => {
  const posts = data.allMarkdownRemark.nodes.map(post => post.frontmatter).slice(0, 6)
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
            <ol className={styles.postList}>
              {posts.map(post => <PostCard post={post} />)}
            </ol>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query BlogPostIndexQuery {
    allMarkdownRemark {
      nodes {
        frontmatter {
          slug
          contentTitle
        }
      }
    }
  }
`
