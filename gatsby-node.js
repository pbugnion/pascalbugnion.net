const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)

// exports.onCreateNode = ({node, getNode}) => {
//     if (node.internal.type === "MarkdownRemark")  {
//         const slug = createFilePath({node, getNode, basePath: "pages"})
//     }
// }

// exports.createPages = async ({graphql, actions}) => {
//     const result = await graphql(`
    
//     `)
// }

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
            component: path.resolve("./src/templates/blog-post.tsx"),
            context: {
                slug: node.frontmatter.slug
            }
        })
    })
}