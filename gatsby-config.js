module.exports = {
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              noInlineHighlight: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
                maxWidth: 800,
                wrapperStyle: "display:block;margin-top:1em;margin-bottom:1em;"
            },
          },
          "gatsby-remark-copy-linked-files",
          "gatsby-plugin-catch-links",
        ],
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
        name: "blog",
        path: `${__dirname}/src/blog-content/`,
      },
    },
  ],
};
