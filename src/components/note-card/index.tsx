import * as React from "react"

import { Link, navigate } from "gatsby"

import TreeIcon from "./TreeIcon"

import styles from "./index.module.css"

export interface NoteCardProps {
  post: {
    contentTitle: string,
    slug: string
  }
}

const NoteCard = ({ post }: NoteCardProps) => {
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

export default NoteCard
