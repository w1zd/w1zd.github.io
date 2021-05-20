import React, { ReactChild, ReactChildren, ReactNode } from "react"
import Footer from "./footer"
import Header from "./header"

// import { rhythm, scale } from "../utils/typography"
import "../../theme-chic/css/base.styl"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader"
import { ReactComponentLike } from "prop-types"
deckDeckGoHighlightElement()

interface Props {
  title?: String
  children?: ReactNode
  nav?: ReactComponentLike
  isFocus?: boolean
}

const Layout = ({ title, children, nav, isFocus }: Props) => {
  // const data =
  return (
    <div className="wrapper">
      {!isFocus && <Header></Header>}

      <main className="main">{children}</main>

      {!isFocus && <Footer></Footer>}
    </div>
  )
}

export default Layout
