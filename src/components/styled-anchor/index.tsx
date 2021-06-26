import * as React from "react"

import styles from "./index.module.css"

export interface StyledAnchorProps {
  href: string
  children: React.ReactNode
}

const StyledAnchor = ({ href, children }: StyledAnchorProps) =>
  <a href={href} className={styles.anchor}>{children}</a>


export const anchorStyle = styles.anchor
export default StyledAnchor
