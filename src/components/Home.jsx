// @ts-nocheck
import React from 'react';
import './Home.css';

const articles = [
  {
    title: "You're Being Lied to About AI's Purpose: What Simon Sinek Teaches Us About Being Human in a Digital Age",
    date: '15 May 2025',
    summary: `AI isn't just about efficiency or replacing jobs—it's about what it means to be human. Drawing on Simon Sinek's insights, this article explores how our search for meaning, connection, and purpose is more important than ever in a digital world.`,
    url: 'https://medium.com/@dwang0816/youre-being-lied-to-about-ai-s-purpose-what-simon-sinek-teaches-us-about-being-human-in-a-digital-99105b23e3dc',
    category: 'Posts',
  }
];

const Home = () => (
  <div className="articles-centerer">
    <article className="article-card">
      <header>
        <h2>{articles[0].title}</h2>
        <div className="article-meta">
          <span>{articles[0].date}</span>
          <span className="dot">•</span>
          <span>{articles[0].category}</span>
        </div>
      </header>
      <p>{articles[0].summary}</p>
      <a className="more-link" href={articles[0].url} target="_blank" rel="noopener noreferrer">Read more</a>
    </article>
  </div>
);

export default Home; 