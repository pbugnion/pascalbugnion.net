import * as React from "react"

import styles from "./index.module.css"

export const Container = ({children}) => {
    return (
        <div className={styles.pageHeader}>
            {children}
        </div>
    )
}

export const Title = ({children}) => {
  return (
    <h1 className={styles.pageHeaderTitle}>{children}</h1>
  )
}

export const Description = ({children}) => {
  return (
    <p className={styles.pageHeaderDescription}>{children}</p>
  )
}
