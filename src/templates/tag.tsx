import React from "react"
import Paginator from "../components/paginator"
import PostsList from "../components/postslist"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Tag = ({ data }) => {
  let tag = ""
  if (typeof window !== `undefined`) {
    tag = decodeURIComponent(window.location.pathname.replace("/tag/", ""))
  }
  return (
    <Layout title={tag} description={tag}>
      <div className="container">
        <PostsList posts={data.allMdx.nodes} catOrTagname={tag}></PostsList>
        <Paginator {...data.allMdx.pageInfo} url="/category"></Paginator>
      </div>
    </Layout>
  )
}

export default Tag
export const pageQuery = graphql`
  query tagsQuery($limit: Int!, $skip: Int!, $tag: String!) {
    allMdx(
      limit: $limit
      skip: $skip
      filter: { frontmatter: { tags: { glob: $tag } } }
      sort: { frontmatter: { date: ASC } }
    ) {
      pageInfo {
        currentPage
        pageCount
      }
      nodes {
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          tags
        }
        id
        fields {
          slug
        }
      }
    }
  }
`
