import React from "react"
import Paginator from "../components/paginator"
import PostsList from "../components/postslist"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Tag = ({ data }) => {
  let tag = "";
  if (typeof window !== `undefined`) {
    tag = window.location.pathname.replace("/tag/", "");
  }
  return (
    <Layout>
      <SEO title={tag}></SEO>
      <div className="container">
        <div className="post-wrap categories">
          <h2 className="post-title">
            -&nbsp;Tag&nbsp;·&nbsp;{tag}-
          </h2>
        </div>
        <PostsList posts={data.allMdx.nodes}></PostsList>
        <Paginator
          {...data.allMdx.pageInfo}
          url="/category"
        ></Paginator>
      </div>
    </Layout>
  )
}

export default Tag
export const pageQuery = graphql`
  query tagsQuery($limit: Int!, $skip: Int!, $tag: String!) {
    allMdx(limit: $limit, skip: $skip, filter: {frontmatter: {tags: {glob: $tag}}}, sort: {fields: frontmatter___date}) {
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
