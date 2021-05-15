const path = require("path");
const { GraphQLString, GraphQLList } = require("gatsby/graphql")

const createNotesPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
     query MyQuery {
       allMdx {
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
      component: path.resolve("./src/templates/note/index.tsx"),
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
  ]
  const blogRules = [
    ["editor-hacking-how-i-learnt-to-stop-worrying-and-love-my-emacs-configuration.html", "editor-hacking"],
    ["flow-types-for-generators-and-coroutines.html", "flow-typing-generators-coroutines"],
    ["how-frustrating-is-your-programming-language.html", "frustrating-programming-language"],
    ["making-yourself-useful-as-a-middle-manager.html", "making-yourself-useful-as-a-middle-manager"],
    ["managing-multiple-aws-credentials-with-pass.html", "managing-aws-credentials-with-pass"],
    ["scala-in-production-four-conventions-for-safer-programs.html", "scala-in-production"],
    ["scala-in-production-making-your-codebase-more-approachable.html", "scala-in-production-2"],
    ["scraping-apis-with-akka-streams-part-2.html", "scraping-apis-with-akka-streams-2"],
    ["scraping-apis-with-akka-streams.html", "scraping-apis-with-akka-streams"],
    ["web-apis-with-scala-and-plotly.html", "plotly-as-lightweight-database"]
  ]

  const {createRedirect} = actions

  baseRules.forEach(([fromPath, toPath]) => {
    createRedirect({fromPath, toPath, isPermanent: true})
  })

  blogRules.forEach(([fromFragment, toFragment]) => {
    const fromPath = `/blog/${fromFragment}`
    const toPath = `/blog/${toFragment}`
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

function findInMarkdown(markdown, regex) {
  const unique = new Set();

  let match;
  while ((match = regex.exec(markdown))) {
    const [, name] = match;
    if (name) {
      unique.add(name);
    }
  }

  return Array.from(unique);
}

REGEX_FENCED_CODE_BLOCK = /^( {0,3}|\t)```[^`\r\n]*$[\w\W]+?^( {0,3}|\t)``` *$/gm;


function cleanupMarkdown(markdown) {
  const replacer = (foundStr) => foundStr.replace(/[^\r\n]/g, "");
  return markdown
    .replace(REGEX_FENCED_CODE_BLOCK, replacer) //// Remove fenced code blocks
    .replace(/<!--[\W\w]+?-->/g, replacer) //// Remove comments
    .replace(/^---[\W\w]+?(\r?\n)---/, replacer); //// Remove YAML front matter
}

const getReferences = (string) => {
  const md = cleanupMarkdown(string);

  const references = findInMarkdown(
    md,
    new RegExp("\\[[^\\]]+\\]\\(([^\\)]+)\\)", "ig")
  )

  return references;
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Mdx: {
      OutboundReferences: {
        type: "[Mdx!]!",
        resolve(source, args, context, info) {
          const allReferences = getReferences(source.internal.content)
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
            cleanedMarkdown = cleanupMarkdown(node.internal.content)
            const reg = new RegExp(`\\[[^\\]]+\\]\\(${source.frontmatter.slug}\\)`, "ig")
            console.log(reg)
            const results = findInMarkdown(cleanedMarkdown, reg)
            console.log(results)
            return results ? true : false;
          })
          return allRelevantNodes
        }
      }
    }
  }
  createResolvers(resolvers)
}
