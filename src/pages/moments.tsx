import React, { useEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Zoom from "react-medium-image-zoom"

const loadGallery = async () => {
  return await fetch("https://a.agg.workers.dev/")
}

const Moments = ({ data }) => {
  const [gallery, setGallery] = useState([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await loadGallery()
        setGallery(await res.json())
      } catch (error) {}
    })()
  }, [])

  return (
    <Layout title="About Me">
      <div className="container">
        <div className="post-wrap gallery">
          {gallery.map(v => {
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
      </div>
    </Layout>
  )
}

export default Moments
