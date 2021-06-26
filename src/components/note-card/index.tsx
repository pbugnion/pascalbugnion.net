import * as React from "react"

import { Link, navigate } from "gatsby"

import TreeIcon from "./TreeIcon"

import styles from "./index.module.css"

export interface NoteCardProps {
  post: {
    contentTitle: string,
    slug: string,
    lastUpdatedDate: string
  };
  key?: string
}

const NoteCard = ({ post }: NoteCardProps) => {
  const { contentTitle, slug, lastUpdatedDate } = post
  return (
    <li>
      <article className={styles.noteCard} onClick={() => navigate(slug)}>
        <TreeIcon />
        <div className={styles.noteCardBodyContainer}>
          <header>
            <h2 className={styles.noteCardTitle}>
              {/* Keep a link for semantics and to encourage Gatsby to
                  preload assets at that link */}
              <Link to={slug}>{contentTitle}</Link>
            </h2>
          </header>
          <footer>
            <abbr className={styles.noteCardDate}>Last modified {lastUpdatedDate}</abbr>
          </footer>
        </div>
      </article>
    </li>
  )
}

export default NoteCard
