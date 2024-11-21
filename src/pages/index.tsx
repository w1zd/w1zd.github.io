import * as React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import "../../theme-chic/css/_page/profile.styl"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data }) => {
  // const  = useStaticQuery()

  const { author, social, description } = data.site.siteMetadata
  return (
    <Layout title="">
      <div className="container">
        <div className="intro">
          <div className="avatar">
            <a href="/posts">
              <GatsbyImage
                image={data.avatar.childImageSharp.gatsbyImageData}
                loading="lazy"
                alt={author.name}
                className="avatar-container"
              />
            </a>
          </div>
          <div className="nickname">{author.name}</div>
          <div className="description">
            <p>{author.summary}</p>
            <p>{description}</p>
          </div>
          <div className="links">
            {Object.keys(social).map(key => (
              <a
                className="link-item"
                title={key}
                href={social[key]}
                key={key}
                rel="me"
              >
                <i className={`iconfont icon-${key.toLowerCase()}`}></i>
              </a>
            ))}
          </div>
          <a
            href="https://wizd.dev/"
            className="h-card"
            rel="me"
            style={{ display: "none" }}
          >
            w1zd
          </a>
        </div>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query ProfileQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.webp/" }) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 128, height: 128)
      }
    }
    site {
      siteMetadata {
        title
        description
        author {
          name
          summary
        }
        social {
          github
        }
      }
    }
  }
`
