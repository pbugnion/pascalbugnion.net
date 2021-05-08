import * as React from "react"

import { graphql, Link } from "gatsby"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import PageHeader from "../../components/page-header"

import styles from "./index.module.css"

const PostCard = ({ post }) => {
  const { contentTitle, slug, lastUpdatedDate } = post
  return (
    <li>
      <article class={styles.postCard}>
        <header>
          <h2>
            <Link to={slug} rel="bookmark">{contentTitle}</Link>
          </h2>
        </header>
        <footer>
          <abbr className={styles.postCardDate}>{lastUpdatedDate}</abbr>
        </footer>
      </article>
    </li>
  )
}

export default () => {
  const post = {
    contentTitle: "hello",
    slug: "/hello",
    lastUpdatedDate: "10th January 2021"
  }
  return (
    <Layout>
      <header>
        <Navbar containerAdditionalStyles={[]} />
      </header>
      <main>
        <div className={`container content-container ${styles.maxWidthContainer}`}>
          <PageHeader>Digital garden</PageHeader>
          Something something something
          <div>
            <ol className={styles.postList}>
              <PostCard post={post} />
            </ol>
          </div>
        </div>
      </main>
    </Layout>
  )
}
