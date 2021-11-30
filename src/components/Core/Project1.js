import React from 'react'
import './Project1.css'
import trees from '../../images/nyc-trees.gif'

const Project1 = () => {
  return (
    <div>
      <section>
        <div className="project-container">
          <img className="project-picture" src={trees}/>
          <h1 className="project-title">NYC Trees</h1>
          <p className="project-description">A data visualization app that display dated trees of New York City.</p>
          <hr className="break"/>
          <p className="project-stacks">React, MapBox, Ruby on Rails, Heroku.</p>
          <div className="project-links">
          <a href="https://nyc-trees-frontend.herokuapp.com/" className="project-site">Site</a>
          <a href="https://github.com/dwang0816/Nyc-Trees-Frontend/blob/master/README.md" className="project-github">Github</a>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Project1
