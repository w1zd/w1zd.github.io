import React from "react"
import { useState, useEffect } from "react"
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
  const currentTheme = window.localStorage && window.localStorage.getItem('theme');
  const [isDark, setisDark] = useState(currentTheme == 'dark' ? true : false);
  const [theme, setTheme] = useState(isDark ? 'Dark': "Light");
  useEffect(() => {
    window.localStorage.setItem("theme", isDark ? 'dark' : 'light');
    if(isDark){
      setTheme('Dark')
      document.getElementsByTagName('body')[0].classList.add('dark-theme');
    }else{
      setTheme('Light')
      document.getElementsByTagName('body')[0].classList.remove('dark-theme');
    }
  }, [isDark])
  const { nav, siteUrl, title } = data.site.siteMetadata
  const toggleTheme = () => {
    setisDark(!isDark);
  }

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
            <input
              id="switch_default"
              type="checkbox"
              className="switch_default"
              checked={isDark}
              onChange={toggleTheme}
            />
            <label htmlFor="switch_default" className="toggleBtn"></label>
          </div>
        </div>
      </nav>
      <nav className="navbar-mobile" id="nav-mobile">
        <div className="container">
          <div className="navbar-header">
            <div>
              <a href="/">{title}</a>
            <a id="mobile-toggle-theme" onClick={toggleTheme}>·&nbsp;{theme}</a>
            </div>
            <div className={`menu-toggle ${isMenuActive? "active": ""}`} onClick={() => {setisMenuActive(!isMenuActive)}}>&#9776; Menu</div>
          </div>
          <div className={`menu ${isMenuActive? "active": ""}`}>
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
