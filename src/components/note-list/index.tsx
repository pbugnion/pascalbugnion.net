import * as React from "react"

import NoteCard from "../note-card"

import styles from "./index.module.css"

export interface NoteListProps {
  notes: Array<{ contentTitle: string, slug: string }>
}

const NoteList = ({ notes }: NoteListProps) => (
  <ol className={styles.postList}>
    {notes.map(post => <NoteCard post={post} key={post.slug} />)}
  </ol>
)

export default NoteList
