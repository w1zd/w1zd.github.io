import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
const Tags = ({ data }) => {
  const rate =
    Math.max.apply(
      null,
      data.allMdx.group.map(item => item.nodes.length),
    ) / 10
  return (
    <Layout title="Tags" description="All Tags">
      <div className="container">
        <div className="post-wrap archive">
          <h2 className="post-title">-&nbsp;Tag Cloud&nbsp;-</h2>

          <div className="tag-cloud-tags">
            {data.allMdx.group.map(item => (
              <Link
                to={`/tag/${item.fieldValue}`}
                data-size={parseInt("" + item.nodes.length / rate)}
                key={item.fieldValue}
              >
                {item.fieldValue}
                <small>({item.nodes.length})</small>
              </Link>
              // <Link to={`/tag/${item.fieldValue}`} data-size={parseInt(""+item.nodes.length / rate)} key={item.fieldValue}>{item.fieldValue}</Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query TagsQuery {
    allMdx {
      group(field: { frontmatter: { tags: SELECT } }) {
        nodes {
          id
        }
        fieldValue
      }
    }
  }
`
