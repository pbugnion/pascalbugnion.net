import * as React from "react"
import { Helmet } from "react-helmet"

import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import CanvasBackground from "../../components/canvas-background"

import styles from "./index.module.css"

const PostCard = ({post}) => {
    const { contentTitle, slug, lastUpdatedDate, summary} = post
    return (
        <li>
            <article class={styles.postCard}>
                <header>
                    <h2>
                        <a href={slug} rel="bookmark">{contentTitle}</a>
                    </h2>
                </header>
                <footer>
                    <abbr className={styles.postCardDate}>{lastUpdatedDate}</abbr>
                </footer>
                <p className={styles.postCardSummary}>{summary}</p>
            </article>
        </li>
    )
}

export default ({ data }) => {
    const posts = data.allMarkdownRemark.nodes.map(post => post.frontmatter)
    return (
        <Layout>
            <Helmet>
                <title>Data diversions | Pascal Bugnion's blog</title>
                <meta 
                  name="description" 
                  content="This is Pascal Bugnion's personal blog. It contains tutorials and opinions on engineering leadership, programming, and artificial intelligence."
                />
            </Helmet>
            <CanvasBackground>
                <header>
                    <Navbar containerAdditionalStyles={[styles.navbarContainer]}/>
                </header>
                <main>
                    <div className={`container ${styles.articleIndexContainer}`}>
                        <ol className={styles.postList}>
                            {posts.map(post => <PostCard post={post} />)}
                        </ol>
                    </div>
                </main>
            </CanvasBackground>
        </Layout>
    )
}

export const query = graphql`
query MyQuery {
    allMarkdownRemark {
      nodes {
        frontmatter {
          slug
          contentTitle
          lastUpdatedDate(formatString: "Do MMMM YYYY")
          summary
        }
      }
    }
  }
`