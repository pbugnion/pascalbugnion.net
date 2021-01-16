import * as React from "react"
import { graphql } from "gatsby"

export default ({data}) => {
    return (
        <>
        <div className="contact-key"></div>
        <div dangerouslySetInnerHTML={{__html: data.markdownRemark.html }} />
        </>
    )
}

export const query = graphql`
  query($slug: String!) {
      markdownRemark(frontmatter: { slug: {eq: $slug }}) {
          html
      }
  }
`