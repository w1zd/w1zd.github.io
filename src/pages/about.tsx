import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

const Tags = ({ data }) => {
  return (
    <Layout title="About Me">
      <div className="container">
        <div className="post-wrap categories">
          <p>
            I go by w1zd, stand for Wizard, proun as he/him. A Front-End
            Developer with over nine years of experience in creating effective
            and innovative web solutions. Skilled in a wide range of front-end
            technologies and frameworks, with additional experience in back-end
            and full-stack development.
          </p>

          <h2>Skills</h2>
          <ul>
            <li>
              <strong>Front-End Programming:</strong> TypeScript, JavaScript,
              React
            </li>
            <li>
              <strong>Application Design:</strong> Agile Workflow, Technical
              Analysis, Software Best Practices
            </li>
            <li>
              <strong>Back-End & Other Technologies:</strong> .Net, Node.js,
              Python, Objective-C
            </li>
            <li>
              <strong>CI/CD Tools:</strong> Jenkins, GitHub Action
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Tags
