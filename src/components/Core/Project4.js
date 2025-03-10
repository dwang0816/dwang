import React from 'react'
import './Project4.css'
import iwomantv from '../../images/iwomantv.jpeg'

const Project4 = () => {
  return (
    <div>
      <section>
        <div className="project-container">
          <img className="project-picture" alt="iwomantv" src={iwomantv}/>
          <h1 className="project-title">iWomanTV</h1>
          <p className="project-description">A social media platform dedicated to fostering meaningful engagement and empowerment for women and minorities. ✨🌍 Built to amplify diverse voices, encourage open conversations, and create an inclusive space where everyone feels heard and valued. Whether through discussions, networking, or community-driven initiatives, this platform is designed to inspire connection and change. 💬🤝</p>
          <hr className="break"/>
          <p className="project-stacks">Wordpress, PHP.</p>
          <div className="project-links">
          <a href="https://iwoman.tv/" className="project-site">Site</a>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Project4
