import * as React from "react"
import headshot from "../../pages/contact/images/Headshot-Pascal-1.jpg"

import { Helmet } from "react-helmet"

export const MainPageHelmet = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    <meta
      name="description"
      content={description}
    />

    <meta property="og:url" content="https://pascalbugnion.net/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={headshot} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="pascalbugnion.net" />
    <meta property="twitter:url" content="https://pascalbugnion.net/" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={headshot} />
    <meta name="twitter:creator" content="@pascalbugnion" />
  </Helmet>
)
  
