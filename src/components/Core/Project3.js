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
          <p className="project-description">A creative space where users can share art, videos, and plant-based remedies designed to promote relaxation and well-being. 🌿✨ Whether you're looking for soothing visuals, calming sounds, or natural healing techniques, this platform brings together a community focused on mindfulness and self-care. 🌸🎶</p>
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
