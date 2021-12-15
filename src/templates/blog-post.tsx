import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import TOC from "../components/toc"
import SEO from "../components/seo"
import { useEffect } from "react"
// import Gitalk from "gitalk"
import "gitalk/dist/gitalk.css"
import "katex/dist/katex.min.css"
import md5 from "blueimp-md5"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Giscus from "react-giscus"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.mdx
  const {
    title: siteTitle,
    postCopyright,
    author,
    siteUrl,
  } = data.site.siteMetadata
  const { previous, next } = pageContext
  // useEffect(() => {
  //   const gitalk = new Gitalk({
  //     clientID: "b2d64df9d83b1b54c039",
  //     clientSecret: "",
  //     repo: "A-GG.github.io",
  //     owner: "A-GG",
  //     admin: ["a-gg"],
  //     id: md5(location.pathname), // Ensure uniqueness and length less than 50
  //     distractionFreeMode: false, // Facebook-like distraction free mode
  //   })

  //   gitalk.render("gitalk-container")
  // }, [location.pathname])

  return (
    <Layout isFocus={false} title={siteTitle}>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description}></SEO>
      <div className="container">
        {post.frontmatter.toc && <TOC></TOC>}

        <article className="post-wrap">
          {/* <a href="/posts" className="goback-posts"><i className={`iconfont icon-blog`}></i></a> */}
          <header className="post-header">
            <h1 className="post-title">{post.frontmatter.title}</h1>
            <div className="post-meta">
            {/* Author:
              <a itemProp="author" rel="author" href="/">
                {data.site.siteMetadata.author.name}
              </a>
              &nbsp; */}
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
                      <a key={item} href={`/category/${item}`}>
                        {item}
                      </a>
                    )
                  })}
                </span>
              )}
            </div>
          </header>

          {/* <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          ></div> */}
          <div className="post-content">
            <MDXRenderer>{post.body}</MDXRenderer>
          </div>

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

          {/* <section className="post-comment" id="gitalk-container"></section> */}
          <Giscus
            repo="gemryan/gemryan.github.io"
            repoId="MDEwOlJlcG9zaXRvcnkyODg3MTA5NjA="
            category="Announcements"
            categoryId="MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMzMDE1OTcy"
            mapping="og:title"
            theme="light"
            reactionsEnabled="1"
          />
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
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
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
