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
          <p className="project-description">A place for users to share art, videos and plant-based treatments to induce relaxation.</p>
          <hr className="break"/>
          <p className="project-stacks">React.js Next.js.</p>
          <div className="project-links">
          <a href="https://deploy--stunning-semolina-2fbfd2.netlify.app/" className="project-site">Site</a>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Project3
