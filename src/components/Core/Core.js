import * as THREE from 'three'

import React, { Component } from 'react'
import Project1 from './Project1'
import Project2 from './Project2'
import Project3 from './Project3'
import "./Core.css"

export default class Core extends Component {

  render() {
    console.log(THREE)
    return (
      <div className="core-container">
        <Project3/>
        <Project1/>
        <Project2/>
        
      </div>
    )
  }
}

