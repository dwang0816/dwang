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
  },
  {
    title: "How AI is Revolutionizing Product Development and Boosting ROI",
    date: '24 May 2025',
    summary: `AI is transforming how businesses innovate, cut costs, and deliver better products. This article explores real-world examples from BMW, PepsiCo, and Netflix, and explains why AI is now essential for long-term growth and competitive advantage.`,
    url: 'https://www.linkedin.com/pulse/how-ai-revolutionizing-product-development-boosting-roi-dennis-wang-2e9ke',
    category: 'AI/Tech',
  },
  {
    title: "New Year Chaos",
    date: '1 Jan 2024',
    summary: `A reflection on the chaos and clarity that comes with the New Year, exploring personal growth, challenges, and the journey ahead.`,
    url: 'https://medium.com/@dwang0816/new-year-chaos-41e8e56cb342',
    category: 'Posts',
  },
  {
    title: "React Hooks: A Gentle Introduction",
    date: '10 Dec 2023',
    summary: `A beginner-friendly guide to understanding and using React Hooks, with practical examples and tips for writing cleaner, more effective React code.`,
    url: 'https://medium.com/@dwang0816/react-hooks-4aacf161c564',
    category: 'Posts',
  },
  {
    title: "Anagram: A Fun Coding Challenge",
    date: '2 Nov 2023',
    summary: `Explore the logic and creativity behind solving an anagram coding challenge, with step-by-step reasoning and code samples for aspiring developers.`,
    url: 'https://medium.com/@dwang0816/anagram-c39da2e4224',
    category: 'Coding',
  }
];

// Sort articles by date (most recent first)
const sortedArticles = [...articles].sort((a, b) => {
  const parseDate = (str) => new Date(str.split(' ').reverse().join(' '));
  return parseDate(b.date) - parseDate(a.date);
});

const Home = () => (
  <div className="articles-centerer">
    {sortedArticles.map((article, idx) => (
      <article className="article-card" key={idx}>
        <header>
          <h2>{article.title}</h2>
          <div className="article-meta">
            <span>{article.date}</span>
            <span className="dot">•</span>
            <span>{article.category}</span>
          </div>
        </header>
        <p>{article.summary}</p>
        <a className="more-link" href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
      </article>
    ))}
  </div>
);

export default Home; 