import React from "react"
import moment from 'moment'
const PostsList = ({posts, catOrTagname}) => {
  let lastYear
  return (
    <div className="post-wrap archive">
      <h2 className="post-title">
        -&nbsp;Categories&nbsp;·&nbsp;{catOrTagname}-
      </h2>
      {posts.map( (node ) => {
        const title = node.frontmatter.title || node.fields.slug
        let curYear = moment(new Date(node.frontmatter.date)).year()

        return (
          <article className="archive-item" key={node.fields.slug}>
            {lastYear !== (lastYear = curYear) ? <h3>{curYear}</h3> : ""}
            <a className="archive-item-link" href={`${node.fields.slug}`}>
              {title}
            </a>
            <span className="archive-item-date">{node.frontmatter.date}</span>
          </article>
        )
      })}
    </div>
  )
}
export default PostsList
