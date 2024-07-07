import React, { useEffect, useState } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Zoom from "react-medium-image-zoom"

const loadGallery = async () => {
  return await fetch(
    "https://api.github.com/repos/w1zd/image-hosting/contents/gallery",
    {
      method: "get",
      headers: {
        Authorization:
          "Bearer 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",
      },
    }
  )
}

const Moments = ({ data }) => {
  const [gallery, setGallery] = useState([])
  useEffect(() => {
    (async () => {
      try {
        const res = await loadGallery()
        setGallery(await res.json())
      } catch (error) {}
    })();
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
