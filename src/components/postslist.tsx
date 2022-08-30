import React from "react"
import moment from 'moment'
const PostsList = ({posts, catOrTagname}) => {
  let lastYear
  return (
    <div className="post-wrap archive">
      <h2 className="post-title">
        -&nbsp;{catOrTagname}&nbsp;-
      </h2>
      {posts.map( (node ) => {
        const title = node.frontmatter.title || node.fields.slug
        let curYear = moment(new Date(node.frontmatter.date)).year()

        return (
          <article className="archive-item" key={node.fields.slug}>
            {lastYear !== (lastYear = curYear) ? <h3>{curYear}</h3> : ""}
            <a className="archive-item-link" href={`${node.fields.slug}`}>
              {title}
              <span className="archive-item-date">{node.frontmatter.date}</span>
            </a>
          </article>
        )
      })}
    </div>
  )
}
export default PostsList
