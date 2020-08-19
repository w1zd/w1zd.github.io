import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

const Tags = ({ data }) => {
  return (
    <Layout>
      <div className="container">
        <div className="post-wrap tags">
            <h2 className="post-title">-&nbsp;Tag Cloud&nbsp;-</h2>

            <div className="tag-cloud-tags">
              {
                data.allMarkdownRemark.group.map(item => (
                  <Link to={`/tags/${item.fieldValue}`} key={item.fieldValue}>{item.fieldValue}<small>({item.nodes.length})</small></Link>
                ))
              }
            </div>
        </div>
    </div>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query TagsQuery {
    allMarkdownRemark {
      group(field: frontmatter___tags) {
        nodes {
          id
        }
        fieldValue
      }
    }
  }
`
