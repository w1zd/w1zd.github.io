import React from "react"
import Paginator from "../components/paginator"
import PostsList from "../components/postslist"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Category = ({ data }) => {
  let cate = ""
  if (typeof window !== `undefined`) {
    cate = window.location.pathname.replace("/category/", "");
  }
  return (
    <Layout>
      <SEO title={cate}></SEO>
      <div className="container">
        <div className="post-wrap categories">
          <h2 className="post-title">
            -&nbsp;Categories&nbsp;·&nbsp;{cate}-
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

export default Category
export const pageQuery = graphql`
  query categoryQuery($limit: Int!, $skip: Int!, $category: String!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { categories: { glob: $category } } }
    ) {
      pageInfo {
        currentPage
        pageCount
      }
      nodes {
        frontmatter {
          categories
          title
          date(formatString: "MMMM DD, YYYY")
        }
        id
        fields {
          slug
        }
      }
    }
  }
`
