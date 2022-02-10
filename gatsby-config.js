module.exports = {
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        remarkPlugins: [
          require("remark-math")
        ],
        rehypePlugins: [
          require("rehype-katex")
        ],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              noInlineHighlight: true,
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 800,
              wrapperStyle: "display:block;margin-top:1em;margin-bottom:1em;"
            },
          },
          "gatsby-remark-copy-linked-files",
        ],
        extensions: [".md", ".mdx"]
      },
    },
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: ["Josefin Sans:300,400", "EB Garamond", "Open Sans"],
        display: "swap",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "note",
        path: `${__dirname}/src/note-content/`,
      },
    },
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: [
          "UA-74417633-1"
        ]
      }
    },
    {
      resolve: "gatsby-plugin-s3",
      options: {
        bucketName: "pascalbugnion.net",
        protocol: "https",
        hostname: "pascalbugnion.net"
      }
    },
  ],
};
