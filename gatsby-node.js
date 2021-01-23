const path = require("path")

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions
    const result = await graphql(`
    query MyQuery {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                slug
              }
              html
            }
          }
        }
      }
    `)
    result.data.allMarkdownRemark.edges.forEach(({node}) => {
        createPage({
            path: node.frontmatter.slug,
            component: path.resolve("./src/templates/blog-post/index.tsx"),
            context: {
                slug: node.frontmatter.slug
            }
        })
    })
}