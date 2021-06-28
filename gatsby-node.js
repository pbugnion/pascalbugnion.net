const path = require("path");
const { GraphQLString, GraphQLList } = require("gatsby/graphql")

const {
  getInternalReferences,
  containsInternalReference
} = require("./server/find-in-markdown")

const createNotesPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
     query MyQuery {
       allMdx(
         filter: {
           frontmatter: {
             onTOC: {
               eq: "yes"
             }
           }
         }
       ) {
         edges {
           node {
             frontmatter {
               slug
             }
           }
         }
       }
     }
  `);
  
  result.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: path.resolve("./src/templates/notes/index.tsx"),
      context: {
        slug: node.frontmatter.slug,
      },
    });
  });
};

const createHtmlRedirects = async({ actions }) => {
  const baseRules = [
    ["/code.html", "/code/"],
    ["/contact.html", "/contact/"],
    ["/blog", "/notes/"]
  ]
  const oldBlogRedirects = [
    ["editor-hacking-how-i-learnt-to-stop-worrying-and-love-my-emacs-configuration.html", "editor-hacking"],
    ["flow-types-for-generators-and-coroutines.html", "flow-typing-generators-coroutines"],
    ["making-yourself-useful-as-a-middle-manager.html", "making-yourself-useful-as-a-middle-manager"],
    ["managing-multiple-aws-credentials-with-pass.html", "managing-aws-credentials-with-pass"],
    ["scala-in-production-four-conventions-for-safer-programs.html", "scala-in-production"],
    ["scala-in-production-making-your-codebase-more-approachable.html", "scala-in-production-2"],
  ]

  const newBlogRedirects = [
    "slack-makes-better-leaders"
  ]

  const {createRedirect} = actions

  oldBlogRedirects.forEach(([fromFragment, toFragment]) => {
    const oldBlogPath = `/blog/${fromFragment}`
    const newBlogPath = `/blog/${toFragment}` // before conversion to digital garden
    const newNotesPath = `/notes/${toFragment}`

    // from old HTML blog to notes
    createRedirect({
      fromPath: oldBlogPath,
      toPath: newNotesPath,
      isPermanent: true
    })

    // from blog to notes
    createRedirect({
      fromPath: newBlogPath,
      toPath: newNotesPath,
      isPermanent: true
    })
  })

  newBlogRedirects.forEach(fragment => {
    const blogPath = `/blog/${fragment}`
    const notesPath = `/notes/${fragment}`
    createRedirect({
      fromPath: blogPath,
      toPath: notesPath,
      isPermanent: true
    })
  })

  // these need to come last since /blog overrides some of the
  // more specific redirects.
  baseRules.forEach(([fromPath, toPath]) => {
    createRedirect({fromPath, toPath, isPermanent: true})
  })
}

const createRedirectAboutContact = async({actions}) => {
  actions.createRedirect(
    {
      fromPath: "/about",
      toPath: "/contact",
      isPermanent: true,
    }
  )
}

exports.createPages = async ({ graphql, actions }) => {
  await createHtmlRedirects({actions})
  await createRedirectAboutContact({actions})
  await createNotesPages({ graphql, actions });
};


exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Mdx: {
      OutboundReferences: {
        type: "[Mdx!]!",
        resolve(source, args, context, info) {
          const allReferences = getInternalReferences(
            source.internal.content)
          const internalReferences = allReferences.filter(
            ref => ref.startsWith("/notes/"))
          const res = context.nodeModel.runQuery({
            query: {
              filter: {
                frontmatter: {
                  slug: { in: internalReferences }
                }
              }
            },
            type: "Mdx",
            firstOnly: false
          })
          return res.then(posts => 
            posts === null ? [] : posts
          )
        }
      },
      InboundReferences: {
        type: "[Mdx!]!",
        resolve(source, args, context, info) {
          const allNodes = context.nodeModel.getAllNodes({ type: "Mdx" })
          allRelevantNodes = allNodes.filter(node => {
            return containsInternalReference(
              node.internal.content,
              source.frontmatter.slug
            )
          })
          return allRelevantNodes
        }
      }
    }
  }
  createResolvers(resolvers)
}
