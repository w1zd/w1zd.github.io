import * as React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"
import "../../theme-chic/css/_page/profile.styl"

import Layout from "../components/layout"

const BlogIndex = ({data}) => {
  // const  = useStaticQuery()

  const { author, social } = data.site.siteMetadata
  return (
    <Layout title={data.site.siteMetadata.title}>
      <div className="container">
        <div className="intro">
          <div className="avatar">
            <a href="/posts">
              <img
                src={data.avatar.childImageSharp.fixed.src}
                alt={author.name}
              />
            </a>
          </div>
          <div className="nickname">{author.name}</div>
          <div className="description">
            <p>{author.summary}</p>
          </div>
          <div className="links">
            {Object.keys(social).map(key => (
              <a className="link-item" title={key} href={social[key]} key={key}>
                <i className={`iconfont icon-${key.toLowerCase()}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
query ProfileQuery {
  avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
    childImageSharp {
      fixed(width: 500, height: 500) {
        ...GatsbyImageSharpFixed
      }
    }
  }
  site {
    siteMetadata {
      title
      author {
        name
        summary
      }
      social {
        github
        twitter
      }
    }
  }
}
`