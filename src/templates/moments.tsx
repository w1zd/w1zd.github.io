import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import Zoom from "react-medium-image-zoom"
import Paginator from "../components/paginator"

const Moments = ({ pageContext }) => {
  return (
    <Layout title="Moments">
      <div className="container">
        <div className="post-wrap gallery">
          {pageContext.items.map(v => {
            return (
              <div className="gallery-item" key={v.sha}>
                <Zoom
                  classDialog="test-class"
                  zoomImg={{
                    src: `https://raw.githubusercontent.com/w1zd/image-hosting/main/gallery/${v.name}`,
                    width: "100%",
                    height: "auto",
                  }}
                >
                  <img
                    src={`https://raw.githubusercontent.com/w1zd/image-hosting/main/thumbnails/280/${v.name}`}
                    alt=""
                  />
                </Zoom>
              </div>
            )
          })}
        </div>
        <Paginator {...pageContext} url="/moments"></Paginator>
      </div>
    </Layout>
  )
}

export default Moments
