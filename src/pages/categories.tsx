import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

const Categories = ({ data }) => {
  return (
    <Layout title="Categories" description="All Posts Categories">
      <div className="container">
        <div className="post-wrap archive">
          <h2 className="post-title">-&nbsp;Categories&nbsp;-</h2>
          <div className="categories-card">
            {data.allMdx.group.map(item => (
              <div className="card-item" key={item.fieldValue}>
                <div className="categories">
                  <a href={`/category/${item.fieldValue}/`}>
                    <h3>
                      <i
                        className="iconfont icon-category"
                        style={{ paddingRight: "3px" }}
                      ></i>
                      {item.fieldValue}
                    </h3>
                  </a>
                  {item.nodes.map((node, index) => {
                    if (index <= 9) {
                      return (
                        <article className="archive-item" key={node.id}>
                          <Link
                            className="archive-item-link"
                            to={`${node.fields.slug}`}
                          >
                            {node.frontmatter.title}
                          </Link>
                        </article>
                      )
                    }
                  })}
                  {item.nodes.length > 10 && (
                    <Link
                      className="more-post-link"
                      to={`/category/${item.fieldValue}`}
                    >
                      More &gt;&gt;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Categories

export const pageQuery = graphql`
  query categoriesQuery {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      group(field: { frontmatter: { categories: SELECT } }) {
        nodes {
          frontmatter {
            categories
            date
            title
          }
          id
          fields {
            slug
          }
        }
        fieldValue
      }
    }
  }
`
