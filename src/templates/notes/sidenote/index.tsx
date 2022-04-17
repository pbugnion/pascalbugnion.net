import * as React from "react"

import * as styles from "./index.module.css"

const Sidenote = ({ children }) => {
  const inputId = React.useId()
  return (
    <aside className={styles.footnoteContainer}>
      <label className="footnote-number" htmlFor={inputId}></label>
      <input type="checkbox" className="margin-toggle" id={inputId} />
      <span className="footnote">{children}</span>
    </aside>
  )
}

export default Sidenote;
