const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
  const result = await graphql(`
    query {
      allMdx(sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            internal {
              contentFilePath
            }
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMdx.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: `${blogPost}?__contentFilePath=${post.node.internal.contentFilePath}`,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  // create Posts List Page
  const postsPerPage = 10
  const numPages = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/posts` : `/posts/${i + 1}`,
      component: path.resolve("./src/templates/posts.tsx"),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    })
  })

  // create Category page
  // const categories = await graphql(
  //   `
  //     query categoryQuery {
  //       allMdx(filter: {}) {
  //         group(field: frontmatter___categories) {
  //           fieldValue
  //           nodes {
  //             id
  //           }
  //         }
  //       }
  //     }
  //   `
  // )

  // categories.data.allMdx.group.forEach(item => {
  //   const numPagesOfTag = Math.ceil(item.nodes.length / postsPerPage)
  //   Array.from({ length: numPagesOfTag }).forEach((_, i) => {
  //     createPage({
  //       path: i === 0 ? `/category/${item.fieldValue}` : `/category/${item.fieldValue}/${i + 1}`,
  //       component: path.resolve("./src/templates/category.tsx"),
  //       context: {
  //         limit: postsPerPage,
  //         skip: i * postsPerPage,
  //         category: item.fieldValue
  //       },
  //     })
  //   })
  // })

  // create Tag Page
  const tags = await graphql(`
    query tagQuery {
      allMdx(filter: {}) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
          nodes {
            id
          }
        }
      }
    }
  `)

  tags.data.allMdx.group.forEach(item => {
    const numPagesOfTag = Math.ceil(item.nodes.length / postsPerPage)
    Array.from({ length: numPagesOfTag }).forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? `/tag/${item.fieldValue}`
            : `/tag/${item.fieldValue}/${i + 1}`,
        component: path.resolve("./src/templates/tag.tsx"),
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          tag: item.fieldValue,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
