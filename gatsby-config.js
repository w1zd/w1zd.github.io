const remarkMath = import(`remark-math`)
module.exports = {
  siteMetadata: {
    title: `Wizard's Lair`,
    author: {
      name: `w1zd`,
      summary: `🤪 A Genius! 🤪 `,
    },
    postCopyright: true,
    description: `Enjoy life && Enjoy Coding`,
    siteUrl: `https://w1zd.xyz`,
    social: {
      twitter: `https://twitter.com/wzdryan`,
      github: `https://github.com/w1zd`,
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
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        remarkPlugins: [remarkMath],
        gatsbyRemarkPlugins: [
          `gatsby-remark-katex`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 900,
            },
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              terminal: 'none',
              theme: 'base16-light'
            }
          },
          `gatsby-remark-copy-linked-files`
        ],
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Wizard's Lair`,
        short_name: `w1zd`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMdx(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Wizard's Lair",
          },
        ],
      },
    }
    // {
    //   resolve: `gatsby-plugin-baidu-analytics`,
    //   options: {
    //       // baidu analytics siteId
    //     siteId: "ca705473dc433c6a2c265605c5775017",
    //     // Put analytics script in the head instead of the body [default:false]
    //     head: false,
    //   },
    // },
  ],
}
