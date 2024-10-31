import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

const Tags = ({ data }) => {
  return (
    <Layout title="About Me">
      <div className="container">
        <div className="post-wrap categories">
          <p>
            Email: <a href="mailto:me@wizd.dev">me@wizd.dev</a>
          </p>
          <p>
            Front-End Developer with over nine years of experience in creating
            effective and innovative web solutions. Skilled in a wide range of
            front-end technologies and frameworks, with additional experience in
            back-end and full-stack development. Proficient in modern JavaScript
            frameworks and committed to designing optimized, scalable
            applications.
          </p>

          <h2>Technical Skills</h2>
          <ul>
            <li>
              <strong>Front-End Programming:</strong> TypeScript, JavaScript,
              React
            </li>
            <li>
              <strong>Application Design:</strong> Agile Workflow, Technical
              Analysis, Software Best Practices, Critical Thinking
            </li>
            <li>
              <strong>Back-End & Other Technologies:</strong> .Net, Node.js,
              Python, Objective-C
            </li>
            <li>
              <strong>CI/CD Tools:</strong> Jenkins, GitHub Action
            </li>
          </ul>

          <h2>Management Skills</h2>
          <ul>
            <li>
              Over three years of experience in team leadership and teaching
              roles
            </li>
            <li>
              Expertise in strategic planning, performance management, and
              project oversight
            </li>
            <li>Experience in recruitment and staff training</li>
          </ul>

          <hr />

          <h2>Work Experience</h2>

          <h3>Senior Front-End Engineer</h3>
          <p>
            <em>06/2021 - 10/2022</em>
          </p>
          <ul>
            <li>
              Led and coached a team of eight developers, achieving a notable
              improvement in team efficiency.
            </li>
            <li>
              Developed a large-scale enterprise CRM platform with low-code
              functionality to streamline application development.
            </li>
            <li>
              Architected scalable, customer-focused software components,
              overseeing the agile development lifecycle to ensure timely
              project delivery.
            </li>
            <li>
              Collaborated with Product Management, UX, QA, and Operations teams
              to integrate customer-focused software solutions, achieving a high
              rate of issue resolution.
            </li>
            <li>
              Delivered efficient production support, reducing system downtime
              and enhancing customer experience.
            </li>
            <li>
              Enhanced application performance, reducing loading times by 80%
              through targeted optimizations.
            </li>
            <li>
              <strong>Technologies used:</strong> React, React Native, Taro,
              Webpack, Node.js, jQuery
            </li>
          </ul>

          <h3>Senior Front-End Engineer</h3>
          <p>
            <em>03/2021 - 06/2021</em>
          </p>
          <ul>
            <li>
              Led a small team of developers, implementing a server cluster
              monitoring application.
            </li>
            <li>
              Developed a CI/CD workflow that streamlined development and
              reduced deployment time.
            </li>
            <li>
              Conducted code reviews, ensuring high standards of quality and
              efficiency in software delivery.
            </li>
            <li>
              <strong>Technologies used:</strong> React, ECharts, Webpack,
              GoFrame
            </li>
          </ul>

          <h3>Front-End Development Teaching Director</h3>
          <p>
            <em>12/2015 - 09/2020</em>
          </p>
          <ul>
            <li>
              Managed a team of 25 educators, developing a curriculum for
              front-end development training programs.
            </li>
            <li>
              Developed and implemented full-stack projects for educational
              purposes, including a mall system, rental system, and content
              management system.
            </li>
            <li>
              Taught front-end development courses, covering programming
              languages, frameworks, and best practices.
            </li>
            <li>
              <strong>Projects:</strong>
            </li>
            <ul>
              <li>
                Full-featured mall system (React, Ant-Design, Java, MySQL)
              </li>
              <li>
                Rental system (Vue.js, ElementUI, Node.js, GraphQL, MongoDB)
              </li>
              <li>Content management system (Bootstrap, jQuery, Node.js)</li>
            </ul>
          </ul>

          <h3>Senior .Net Developer</h3>
          <p>
            <em>10/2014 - 11/2015</em>
          </p>
          <ul>
            <li>
              Collaborated with technical teams to develop a ticketing system
              for a large public venue.
            </li>
            <li>
              Contributed to system architecture and integration, optimizing
              existing ticketing processes.
            </li>
            <li>
              <strong>Technologies used:</strong> ASP.Net MVC, Entity Framework,
              MySQL, Ext.js, .Net Win Form
            </li>
          </ul>

          <h3>.Net Developer</h3>
          <p>
            <em>08/2012 - 10/2014</em>
          </p>
          <ul>
            <li>
              Developed a widely-used game for a major international sports
              event.
            </li>
            <li>
              Integrated payment solutions, enhancing functionality and user
              experience.
            </li>
            <li>
              Improved code quality, contributing to project efficiency and
              maintainability.
            </li>
            <li>
              <strong>Technologies used:</strong> ASP.Net MVC, Entity Framework,
              MySQL, jQuery
            </li>
          </ul>

          <h2>Achievements</h2>
          <ul>
            <li>
              Awarded Outstanding Employee for exceptional contributions to
              project success.
            </li>
            <li>
              Received national-level awards in software and programming
              competitions.
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Tags
