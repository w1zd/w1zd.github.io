import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import TOC from "../components/toc"
import SEO from "../components/seo"
// import { rhythm, scale } from "../utils/typography"
import { useEffect } from "react"
import Gitalk from "gitalk"
import "gitalk/dist/gitalk.css"
import md5 from "blueimp-md5"
import { Helmet } from "react-helmet"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const {
    title: siteTitle,
    postCopyright,
    author,
    siteUrl,
  } = data.site.siteMetadata
  const { previous, next } = pageContext
  useEffect(() => {
    const gitalk = new Gitalk({
      clientID: "b2d64df9d83b1b54c039",
      clientSecret: "0696af88afb5cf1c7ee3732d34c78464092faab8",
      repo: "A-GG.github.io",
      owner: "A-GG",
      admin: ["a-gg"],
      id: md5(location.pathname), // Ensure uniqueness and length less than 50
      distractionFreeMode: false, // Facebook-like distraction free mode
    })

    gitalk.render("gitalk-container")
  }, [location.pathname])

  return (
    <Layout isFocus={false} title={siteTitle}>
      <SEO title={post.frontmatter.title}></SEO>
      <Helmet>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"
          async
        ></script>
      </Helmet>
      <div className="container">
        {post.frontmatter.toc && <TOC></TOC>}

        <article className="post-wrap">
          {/* <a href="/posts" className="goback-posts"><i className={`iconfont icon-blog`}></i></a> */}
          <header className="post-header">
            <h1 className="post-title">{post.frontmatter.title}</h1>
            <div className="post-meta">
              <span className="post-author">{data.site.siteMetadata.author.name}</span>
              <span className="post-time">{post.frontmatter.date}</span>
              &nbsp;
              {/* {post.frontmatter.categories.length !== 0 && (
                <span className="post-category">
                  Category:
                  {post.frontmatter.categories.map(item => {
                    return (
                      <a key={item} href={`/category/${item}`}>
                        {item}
                      </a>
                    )
                  })}
                </span>
              )} */}
            </div>
          </header>

          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          ></div>
          {/* {postCopyright && (
            <section className="post-copyright">
              <p className="copyright-item">
                <span>Author:&nbsp;</span>
                <span>{author.name}</span>
              </p>

              <p className="copyright-item">
                <span>Permalink:</span>
                <span>
                  <a href={siteUrl + post.fields.slug}>
                    {" "}
                    {siteUrl + post.fields.slug}{" "}
                  </a>
                </span>
              </p>

              <p className="copyright-item">
                <span>License:&nbsp;</span>
                <span>
                  本博客所有文章除特别声明外，均采用{" "}
                  <a href="http://creativecommons.org/licenses/by-nc/4.0/">
                    CC-BY-NC-4.0
                  </a>{" "}
                  许可协议。转载请注明出处！
                </span>
              </p>
            </section>
          )} */}

          {/* <section className="post-tags">
            <div>
              <span>Tag(s):</span>
              <span className="tag">
                {post.frontmatter.tags.length !== 0 &&
                  post.frontmatter.tags.map(item => {
                    return (
                      <a key={item} href={`/tag/${item}`}>
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
          </section> */}
          {/* <section className="post-nav">
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
          </section> */}

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
        postCopyright
        siteUrl
        author {
          name
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        categories
        tags
        toc
      }
    }
  }
`
