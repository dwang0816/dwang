// @ts-nocheck
import React from 'react';
import './Games.css';

const games = [
  {
    title: 'Miraj Visualizer',
    description: 'An interactive visual experience built to explore and animate music or motion. A creative experiment blending audio and visual elements into an immersive browser-based display.',
    stack: 'React, Vercel',
    links: [
      { label: 'Play', url: 'https://miraj-visualizer.vercel.app' }
    ]
  },
  {
    title: 'How Deep Will You Go?',
    description: 'A reflective, question-based experience that invites you to explore how far you are willing to go with your thoughts, answers, and self-discovery. Go shallow or dive deep.',
    stack: 'React, Vercel',
    links: [
      { label: 'Play', url: 'https://how-deep-will-you-go-delta.vercel.app' }
    ]
  },
  {
    title: 'We Are Not Strangers',
    description: 'A digital adaptation of the popular connection card game. Draw cards, answer meaningful questions, and build genuine connections with the people around you.',
    stack: 'React, Vercel',
    links: [
      { label: 'Play', url: 'https://we-are-not-really-strangers.vercel.app' }
    ]
  }
];

const Games = () => (
  <div className="games-container">
    <div className="games-wrapper">
      <div className="games-content">
        <h2>Play</h2>
        <p className="games-subtitle">Interactive experiences and experiments.</p>
        <div className="games-grid">
          {games.map((game, idx) => (
            <div className="game-item" key={idx}>
              <div className="game-header">
                <h3 className="game-title">{game.title}</h3>
              </div>
              <p className="game-description">{game.description}</p>
              <div className="game-footer">
                <span className="game-stack">{game.stack}</span>
                <div className="game-links">
                  {game.links.map((link, lidx) => (
                    <a
                      href={link.url}
                      key={lidx}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="game-link"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Games;
