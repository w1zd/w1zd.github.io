module.exports = {
  siteMetadata: {
    title: `AGG`,
    author: {
      name: `AGG`,
      summary: `🤪 Aha! Go Gaga! 🤪 `,
    },
    postCopyright: true,
    description: `Enjoy life && Enjoy Coding`,
    siteUrl: `https://agg.me`,
    social: {
      twitter: `https://twitter.com/ryan__pan`,
      github: `https://github.com/a-gg`,
      wechat: `/wechat.jpg`,
      qq: `http://wpa.qq.com/msgrd?v=3&uin=5472965&site=qq&menu=yes`,
    },
    nav: [
      { name: "Posts", url: "/posts" },
      { name: "Categories", url: "/categories" },
      { name: "Tags", url: "/tags" },
      { name: "About", url: "/about" },
    ],
  },
  plugins: [
    `gatsby-plugin-stylus`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              terminal: 'carbon',
              theme: 'zenburn'
            }
          },
          // `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `AGG's Blog`,
        short_name: `AGG`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    // {
    //   resolve: `gatsby-plugin-typography`,
    //   options: {
    //     pathToConfigModule: `src/utils/typography`,
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
