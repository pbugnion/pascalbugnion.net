import * as React from "react"

import styles from "./index.module.css"

export default () => {
    return (
        <div className={styles.backgroundImage}>
            <div className={styles.contentContainer}>
                <div className={styles.inside}>
                    <h1 className={styles.lead}>
                        Hi. I&#8217;m Pascal.
                    </h1>
                    <div className={styles.description}>
                        <p className={styles.descriptionParagraph}>I'm a technical architect. I build tools for data scientists.</p>
                        <p className={styles.descriptionParagraph}>This is my site. It is a repository for talks and software I have written and a blog about data engineering, maths, and software development.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}