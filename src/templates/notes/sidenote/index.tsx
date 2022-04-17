import * as React from "react"

import * as styles from "./index.module.css"

const Sidenote = ({ children }) => {
  const inputId = React.useId()
  return (
    <aside className={styles.sidenoteContainer}>
      <label className={styles.sidenoteNumber} htmlFor={inputId}></label>
      <input type="checkbox" className={styles.marginToggle} id={inputId} />
      <span className={styles.sidenote}>{children}</span>
    </aside>
  )
}

export default Sidenote;
