module.exports = {
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-remark",
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: [
            "Josefin Sans\:300,400",
        ],
        display: "swap"
      },
    },
    {
        resolve: "gatsby-source-filesystem",
        options: {
            name: "blog",
            path: `${__dirname}/src/blog-content/`
        }
    }
  ],
};