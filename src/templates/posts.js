import React from "react"
import { graphql } from "gatsby"
import moment from "moment"

// import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
// import { rhythm } from "../utils/typography"
import Paginator from '../components/paginator'

const Posts = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges
  let lastYear
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <div className="post-wrap archive">
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          let curYear = moment(new Date(node.frontmatter.date)).year()

          return (
            <article className="archive-item" key={node.fields.slug}>
              {lastYear !== (lastYear = curYear) ? <h3>{curYear}</h3> : ""}
              <a className="archive-item-link" href={`${node.fields.slug}`}>
                {title}
              </a>
              <span className="archive-item-date">{node.frontmatter.date}</span>
            </article>
          )
        })}
      </div>
      <Paginator {...data.allMarkdownRemark.pageInfo}></Paginator>
    </Layout>
  )
}

export default Posts

export const pageQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        itemCount
        pageCount
        perPage
        totalCount
      }
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
// (formatString: "MMMM DD, YYYY")
