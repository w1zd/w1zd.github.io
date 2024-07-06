import React from "react"
import Paginator from "../components/paginator"
import PostsList from "../components/postslist"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const Category = ({ data }) => {
  let cate = ""
  if (typeof window !== `undefined`) {
    cate = decodeURIComponent(window.location.pathname.replace(/\/category\/(.*)\/.*/, "$1"));
  }
  return (
    <Layout title={cate} description={cate}>
      <div className="container">
        <PostsList posts={data.allMdx.nodes} catOrTagname={cate}></PostsList>
        <Paginator
          {...data.allMdx.pageInfo}
          url={`/category/${cate}`}
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
