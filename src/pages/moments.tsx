import React, { useEffect } from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import images from "../../content/gallery.json"
import mediumZoom from "medium-zoom"

const Moments = ({ data }) => {
  useEffect(() => {
    mediumZoom(".gallery-item img", { background: "#292a2d" })
  }, []);
  return (
    <Layout title="About Me">
      <div className="container">
        <div className="post-wrap gallery">
          {images.map(v => {
            return (
              <div className='gallery-item' key={v.sha}>
                <img src={v.download_url} alt="" />
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export default Moments
