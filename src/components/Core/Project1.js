import React from 'react'
import './Project1.css'
import trees from '../../images/nyc-trees.gif'

const Project1 = () => {
  return (
    <div>
      <section>
        <div className="project-container">
          <img className="project-picture" alt="nyc-trees" src={trees}/>
          <h1 className="project-title">NYC Trees</h1>
          <p className="project-description">🌳 NYC Tree Explore the City's Green History!

NYC Tree is a data visualization app that showcases the diverse and historic trees of New York City. 🌎 Using interactive maps and detailed insights, users can explore dated trees across the city, uncovering their species, age, and ecological impact. Whether you're an urban explorer, nature enthusiast, or data lover, this app brings the green heartbeat of NYC to life. 🌿✨</p>
          <hr className="break"/>
          <p className="project-stacks">React.js, MapBox.js, Ruby on Rails.</p>
          <div className="project-links">
          <a href="https://scintillating-pasca-0fd429.netlify.app/" className="project-site">Site</a>
          <a href="https://github.com/dwang0816/Nyc-Trees-Frontend/blob/master/README.md" className="project-github">Github</a>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Project1
