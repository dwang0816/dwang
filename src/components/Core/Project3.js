import React from 'react'
import './Project3.css'
import moodiday from '../../images/moodiday.gif'

const Project3 = () => {
  return (
    <div>
      <section>
        <div className="project-container">
          <img className="project-picture" alt="moodiday" src={moodiday}/>
          <h1 className="project-title">Moodi Day</h1>
          <p className="project-description">Find New Ways to Chill Out.</p>
          <hr className="break"/>
          <p className="project-stacks">Next.js, Scss, Netlify.</p>
          <div className="project-links">
          <a href="https://moodiday.com/" className="project-site">Site</a>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Project3
