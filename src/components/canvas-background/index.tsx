import * as React from "react"

import styles from "./index.module.css"

export type CanvasBackgroundProps = {
    children: React.ReactNode
}

export default ({children}: CanvasBackgroundProps) => (
    <div className={styles.postListBackground}>
        {children}
    </div>
)