import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Paginator from '../components/paginator'
import PostsList from '../components/postslist'

const Posts = ({ data, location }) => {
  const posts = data.allMdx.nodes
  
  return (
    <Layout title="All posts">
      <PostsList posts={posts}></PostsList>
      <Paginator {...data.allMdx.pageInfo} url="/posts"></Paginator>
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
    allMdx(
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
      nodes {
        excerpt
        frontmatter {
          description
          date(formatString: "MMMM DD, YYYY")
          title
        }
        id
        fields {
          slug
        }
      }
     
    }
  }
`
// (formatString: "MMMM DD, YYYY")
