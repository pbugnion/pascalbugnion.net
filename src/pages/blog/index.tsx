import * as React from "react"
import { Helmet } from "react-helmet"

import Layout from "../../components/layout"
import { graphql } from "gatsby"

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
    console.log(posts)
    return (
        <Layout>
            <Helmet>
                <title>Data diversions | Pascal Bugnion's blog</title>
            </Helmet>
            <header>
                <nav className="navbar navbar-expand-md navbar-light fixed-top" id="top-navbar">
                    <div className="container">
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
            <main className={styles.postListBackground}>
                <div className={`container ${styles.articleIndexContainer}`}>
                    <ol className={styles.postList}>
                        {posts.map(post => <PostCard post={post} />)}
                    </ol>
                </div>
            </main>
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