import React, { ReactChild, ReactChildren, ReactNode } from "react"
import Footer from "./footer"
import Header from "./header"

// import { rhythm, scale } from "../utils/typography"
import "../../theme-chic/css/base.styl"
import 'react-medium-image-zoom/dist/styles.css'
import { ReactComponentLike } from "prop-types"
import SEO from "./seo"

interface Props {
  title?: string
  children?: ReactNode
  nav?: ReactComponentLike
  isFocus?: boolean
  description?: string
}

const Layout = ({ title, children, nav, isFocus, description }: Props) => {
  // const data =
  return (
    <div className="wrapper">
      <SEO title={title} description={description}></SEO>
      {!isFocus && <Header></Header>}

      <main className="main">{children}</main>

      {!isFocus && <Footer></Footer>}
    </div>
  )
}

export default Layout
