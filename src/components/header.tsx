import React from "react"
import { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ThemeToggler } from "gatsby-plugin-dark-mode"

const Header = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
          title
          nav {
            name
            url
          }
        }
      }
    }
  `)
  const [isMenuActive, setisMenuActive] = useState(false)
  const { nav, title } = data.site.siteMetadata

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-header header-logo">
            <a href="/">{title}</a>
          </div>
          <div className="menu navbar-right">
            {nav.map(item => (
              <a className="menu-item" href={item.url} key={item.name}>
                {item.name}
              </a>
            ))}
            <ThemeToggler>
              {({ theme, toggleTheme }) => (
                <>
                  <input
                    id="switch_default"
                    type="checkbox"
                    className="switch_default"
                    checked={theme === "dark-mode"}
                    onChange={e =>
                      toggleTheme(e.target.checked ? "dark-mode" : "light-mode")
                    }
                  />
                  <label htmlFor="switch_default" className="toggleBtn"></label>
                </>
              )}
            </ThemeToggler>
          </div>
        </div>
      </nav>
      <nav className="navbar-mobile" id="nav-mobile">
        <div className="container">
          <div className="navbar-header">
            <div>
              <a href="/">{title}</a>
              <ThemeToggler>
                {({ theme, toggleTheme }) => (
                  <a id="mobile-toggle-theme" onClick={() => {
                    toggleTheme(theme === "dark-mode"? "light-mode": "dark-mode")
                  }}>
                    &nbsp;·&nbsp;{theme === "dark-mode" ? "Dark" : "Light"}
                  </a>
                )}
              </ThemeToggler>
            </div>
            <div
              className={`menu-toggle ${isMenuActive ? "active" : ""}`}
              onClick={() => {
                setisMenuActive(!isMenuActive)
              }}
            >
              &#9776; Menu
            </div>
          </div>
          <div className={`menu ${isMenuActive ? "active" : ""}`}>
            {nav.map(item => (
              <a className="menu-item" href={item.url} key={item.name}>
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
