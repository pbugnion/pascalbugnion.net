import * as React from "react"

import { Link } from "gatsby"

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
                        <p className={styles.descriptionParagraph}>
                            I'm a technical lead at <a href="https://faculty.ai">Faculty</a>. I build tools for data scientists.
                        </p>
                        <p className={styles.descriptionParagraph}>
                            This is my site. It has some information <Link to="/contact">about me</Link> and <Link to="/code">projects</Link> I work on, both at work in my spare time. 
                            I also sometimes <Link to="/blog">write</Link> about data science, software, and leading software teams.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}