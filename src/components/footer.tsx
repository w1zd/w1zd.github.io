import React from "react"
import { useStaticQuery, graphql } from "gatsby"
const Footer = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          author {
            name
            summary
          }
        }
      }
    }
  `)
  const { author } = data.site.siteMetadata
  return (
    <footer id="footer" className="footer">
      <div className="copyright">
        <span>
          © {author.name} | Powered by{" "}
          <a href="https://www.gatsbyjs.com/" target="_blank">
            Gatsby
          </a>{" "}
          &{" "}
          <a href="https://github.com/Siricee/hexo-theme-Chic" target="_blank">
            Chic
          </a>
        </span>
      </div>
    </footer>
  )
}

export default Footer