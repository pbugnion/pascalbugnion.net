import * as React from "react"

import * as styles from "./index.module.css"

const FullWidthImage = ({ src }) => (
  <img src={src} className={styles.fullWidthImage}/>
)

export default FullWidthImage
