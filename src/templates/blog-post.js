import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import TOC from "../components/toc"
import SEO from "../components/seo"
// import { rhythm, scale } from "../utils/typography"
import { useEffect } from "react"
import Gitalk from 'gitalk'
import 'gitalk/dist/gitalk.css'
import md5 from 'blueimp-md5'

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext
  useEffect(() => {
    const gitalk = new Gitalk({
      clientID: "b2d64df9d83b1b54c039",
      clientSecret: "0696af88afb5cf1c7ee3732d34c78464092faab8",
      repo: "A-GG.github.io",
      owner: "A-GG",
      admin: [
        "a-gg",
      ],
      id: md5(window.location.pathname), // Ensure uniqueness and length less than 50
      distractionFreeMode: false, // Facebook-like distraction free mode
    });

    gitalk.render("gitalk-container");
  }, [])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={siteTitle}></SEO>
      <div className="container">
        <TOC></TOC>
        <article className="post-wrap">
          <header className="post-header">
            <h1 className="post-title">{post.frontmatter.title}</h1>
            <div className="post-meta">
              Author:
              <a itemProp="author" rel="author" href="/">
                {data.site.siteMetadata.author.name}
              </a>
              &nbsp;
              <span className="post-time">
                Date:
                <a href="#/">{post.frontmatter.date}</a>
              </span>
              &nbsp;
              {post.frontmatter.categories.length !== 0 && (
                <span className="post-category">
                  Category:
                  {post.frontmatter.categories.map(item => {
                    return (
                      <a key={item} href={`categories/${item}`}>
                        {item}
                      </a>
                    )
                  })}
                </span>
              )}
            </div>
          </header>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          ></div>

          <section className="post-tags">
            <div>
              <span>Tag(s):</span>
              <span className="tag">
                {post.frontmatter.tags.length !== 0 &&
                  post.frontmatter.tags.map(item => {
                    return (
                      <a key={item} href={`tags/${item}`}>
                        {item}
                      </a>
                    )
                  })}
              </span>
            </div>
            <div>
              <a
                href="#/"
                onClick={() => {
                  window.history.back()
                }}
              >
                back
              </a>
              <span>· </span>
              <a href={data.site.siteMetadata.siteUrl}>home</a>
            </div>
          </section>
          <section className="post-nav">
            {previous && (
              <a className="prev" rel="prev" href={previous.fields.slug}>
                {previous.frontmatter.title}
              </a>
            )}
            {next && (
              <a className="next" rel="next" href={next.fields.slug}>
                {next.frontmatter.title}
              </a>
            )}
          </section>

          <section className="post-comment" id="gitalk-container"></section>
        </article>
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY HH:mm:ss")
        description
        categories
        tags
      }
    }
  }
`
