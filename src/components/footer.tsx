import React from "react"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"
const Footer = () => {
  const loaction = useLocation()
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
        {location.pathname === "/" ? (
          <span className="webring">
            <a href="https://xn--sr8hvo.ws/previous">←</a>
            <a href="https://xn--sr8hvo.ws">🕸💍</a>
            <a href="https://xn--sr8hvo.ws/next">→</a>
          </span>
        ) : (
          <span>© {author.name}</span>
        )}
      </div>
    </footer>
  )
}

export default Footer

