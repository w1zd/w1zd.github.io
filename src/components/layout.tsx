import React, { ReactChild, ReactChildren, ReactNode } from "react"
import Footer from './footer'
import Header from './header'

// import { rhythm, scale } from "../utils/typography"
import "../../theme-chic/css/base.styl"
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader';
import { ReactComponentLike } from "prop-types";
deckDeckGoHighlightElement();

interface Props  {
  title?: String,
  children?: ReactNode,
  nav?: ReactComponentLike
}

const Layout = ({title, children, nav }: Props) => {
  // const data = 
  return (
    <div className="wrapper">
      <Header></Header>
     
      <main className="main">{children}</main>

      <Footer></Footer>
    </div>
  )
}

export default Layout
