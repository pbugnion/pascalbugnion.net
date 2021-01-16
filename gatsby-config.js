module.exports = {
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: [
            "Josefin Sans\:300,400",
        ],
        display: "swap"
      },
    },
  ],
};