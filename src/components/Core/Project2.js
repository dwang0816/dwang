import React from 'react'
import './Project1.css'
import stripeify from '../../images/stripeify.gif'

const Project1 = () => {
  return (
    <div>
      <section>
        <div className="project-container">
          <img className="project-picture" alt="stripefy" src={stripeify}/>
          <h1 className="project-title">Stripeify</h1>
          <p className="project-description">A React.js web app where users can create, listen to, and vote on playlists. 🎶🔥</p>
          <hr className="break"/>
          <p className="project-stacks">React.js, Ruby on Rails, PostgreSQL, AudioSpectrum.</p>
          <div className="project-links">
          <a href="https://github.com/dwang0816/Stripeify-Frontend" className="project-site">Frontend</a>
          <a href="https://github.com/dwang0816/stripeify-backend" className="project-github">Backend</a>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Project1
