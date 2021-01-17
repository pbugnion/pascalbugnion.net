import * as React from "react"

import styles from "./index.module.css"

const PageHeader = ({children}) => {
    return (
        <div className={styles.pageHeader}>
            <h1>{children}</h1>
        </div>
    )
}

export default PageHeader;