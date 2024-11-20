module.exports = {
  siteMetadata: {
    title: `Wizard's Lair`,
    author: {
      name: `w1zd`,
      summary: `🤪 A Genius! 🤪 `,
    },
    postCopyright: true,
    description: `Enjoy life && Enjoy Coding`,
    siteUrl: `https://wizd.dev`,
    social: {
      // twitter: `https://twitter.com/wzdryan`,
      github: `https://github.com/w1zd`,
      // wechat: `/wechat.jpg`,
      // qq: `http://wpa.qq.com/msgrd?v=3&uin=5472965&site=qq&menu=yes`,
    },
    nav: [
      { name: "Posts", url: "/posts" },
      // { name: "Categories", url: "/categories" },
      // { name: "Tags", url: "/tags" },
      // { name: "Feeds", url: "/feeds" },
      { name: "Moments", url: "/moments" },
      { name: "About", url: "/about" },
    ],
  },
  plugins: [
    `gatsby-plugin-stylus`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-katex",
            options: {
              strict: "ignore",
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 900,
            },
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: "superscript",
                  extend: "javascript",
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: "root",
                host: "localhost",
                global: false,
              },
              escapeEntities: {},
            },
          },
          `gatsby-remark-copy-linked-files`,
          {
            resolve: "gatsby-remark-obsidian",
            options: {
              titleToURL: title => `/${title}`,
            },
          },
        ],
      },
    },
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
        icon: `content/assets/gatsby-icon.webp`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-catch-links`,
      options: {
        excludePattern: /(excluded-link|external)/,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt ?? node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.body }],
                })
              })
            },
            query: `
                {
                  allMdx(sort: {frontmatter: {date: DESC}}) {
                   nodes {
                      excerpt
                      body
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        description
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
    },
    "gatsby-plugin-sitemap",
    "gatsby-plugin-dark-mode",
  ],
}
