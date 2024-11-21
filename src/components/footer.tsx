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
        <span>© {author.name}</span>
      </div>
      <a href="https://xn--sr8hvo.ws/previous">←</a>
      <a href="https://xn--sr8hvo.ws">🕸💍</a>
      <a href="https://xn--sr8hvo.ws/next">→</a>
    </footer>
  )
}

export default Footer

