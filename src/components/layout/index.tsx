import * as React from "react"

import "bootstrap/dist/css/bootstrap.min.css"
import "prismjs/themes/prism-solarizedlight.css"
import * as pageStyles from "../../styles/page.module.css"

export default ({ children }) => {
  return <div id={pageStyles.page}>{children}</div>
}
