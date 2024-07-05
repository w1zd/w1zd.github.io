import React from "react"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useStaticQuery, graphql } from "gatsby"

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
            {/* <input
              id="switch_default"
              type="checkbox"
              className="switch_default"
              checked={darkMode.value}
              onChange={darkMode.toggle}
            />
            <label htmlFor="switch_default" className="toggleBtn"></label> */}
          </div>
        </div>
      </nav>
      <nav className="navbar-mobile" id="nav-mobile">
        <div className="container">
          {/* <div className="navbar-header">
            <div>
              <a href="/">{title}</a>
              <a id="mobile-toggle-theme" onClick={darkMode.toggle}>&nbsp;·&nbsp;{darkMode.value ? "Dark" : "Light"}</a>
            </div>
            <div className={`menu-toggle ${isMenuActive? "active": ""}`} onClick={() => {setisMenuActive(!isMenuActive)}}>&#9776; Menu</div>
          </div> */}
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
