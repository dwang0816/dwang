// @ts-nocheck
import React from 'react';
import './Home.css';

const sideProjects = [
  {
    title: 'Case Study: Automating Inventory Updates for Hadson Toko',
    date: 'Ongoing',
    readTime: 'Side Project',
    summary: 'Designing and implementing a lightweight automation pipeline to sync product inventory across sales channels. Focus areas: operational bottleneck discovery, data flow mapping, API/webhook strategy, and measurable impact on manual workload.',
    url: 'https://www.notion.so/Case-Study-Automating-Inventory-Updates-for-Hadson-Toko-24bd1d71cfeb80fc9230db9d763d2475?source=copy_link',
    category: 'Current Project',
  }
];

const articles = [
  {
    title: "Why Moving to Pomona, California Might Be the Smartest Decision You Make",
    date: '4 Jun 2025',
    readTime: '5 min read',
    summary: `An AI-powered case study analyzing Pomona's emerging real estate market using Notion. Located at the crossroads of major freeways with significantly lower prices than neighboring cities, Pomona offers compelling investment opportunities. This AI-driven analysis explores prime location advantages, affordability metrics, city revitalization initiatives, and long-term growth potential for both homebuyers and investors.`,
    url: 'https://www.notion.so/Why-Moving-to-Pomona-California-Might-Be-the-Smartest-Decision-You-Make-208d1d71cfeb8068ace6c8bb79d85b3b?source=copy_link',
    category: 'AI/Real Estate',
  },
  {
    title: "You're Being Lied to About AI's Purpose: What Simon Sinek Teaches Us About Being Human in a Digital Age",
    date: '15 May 2025',
    readTime: '4 min read',
    summary: `AI isn't just about efficiency or replacing jobs—it's about what it means to be human. Drawing on Simon Sinek's insights, this article explores how our search for meaning, connection, and purpose is more important than ever in a digital world.`,
    url: 'https://medium.com/@dwang0816/youre-being-lied-to-about-ai-s-purpose-what-simon-sinek-teaches-us-about-being-human-in-a-digital-99105b23e3dc',
    category: 'Posts',
  },
  {
    title: "How AI is Revolutionizing Product Development and Boosting ROI",
    date: '24 May 2025',
    readTime: '6 min read',
    summary: `AI is transforming how businesses innovate, cut costs, and deliver better products. This article explores real-world examples from BMW, PepsiCo, and Netflix, and explains why AI is now essential for long-term growth and competitive advantage.`,
    url: 'https://www.linkedin.com/pulse/how-ai-revolutionizing-product-development-boosting-roi-dennis-wang-2e9ke',
    category: 'AI/Tech',
  },
  {
    title: "New Year Chaos",
    date: '1 Jan 2024',
    readTime: '3 min read',
    summary: `A reflection on the chaos and clarity that comes with the New Year, exploring personal growth, challenges, and the journey ahead.`,
    url: 'https://medium.com/@dwang0816/new-year-chaos-41e8e56cb342',
    category: 'Posts',
  },
  {
    title: "React Hooks: A Gentle Introduction",
    date: '10 Dec 2023',
    readTime: '7 min read',
    summary: `A beginner-friendly guide to understanding and using React Hooks, with practical examples and tips for writing cleaner, more effective React code.`,
    url: 'https://medium.com/@dwang0816/react-hooks-4aacf161c564',
    category: 'Posts',
  },
  {
    title: "Anagram: A Fun Coding Challenge",
    date: '2 Nov 2023',
    readTime: '4 min read',
    summary: `Explore the logic and creativity behind solving an anagram coding challenge, with step-by-step reasoning and code samples for aspiring developers.`,
    url: 'https://medium.com/@dwang0816/anagram-c39da2e4224',
    category: 'Coding',
  },
  {
    title: "Precision and Pen: Why Specificity and Note-Taking Matter More Than You Think",
    date: '16 Jun 2025',
    readTime: '2 min read',
    summary: `In an age of infinite scroll and ambient information, most people consume far more than they retain. The result is a brittle kind of knowledge — vague impressions, recycled takes, and a feeling of being informed without the benefits of actual recall or application. At the core of this dysfunction is a refusal to be specific and a neglect of disciplined note-taking.`,
    url: 'https://medium.com/@dwang0816/precision-and-pen-why-specificity-and-note-taking-matter-more-than-you-think-1486f1fbd788',
    category: 'Posts',
  },
];

// Sort articles by date (most recent first)
const sortedArticles = [...articles].sort((a, b) => {
  const parseDate = (str) => new Date(str.split(' ').reverse().join(' '));
  return parseDate(b.date) - parseDate(a.date);
});

const Home = () => (
  <div className="articles-centerer">
    {sideProjects.map((sp, idx) => (
      <article className="article-card" key={`sp-${idx}`}>
        <header>
          <h2>{sp.title}</h2>
          <div className="article-meta">
            <span>{sp.date}</span>
            <span className="dot">•</span>
            <span>{sp.readTime}</span>
            <span className="dot">•</span>
            <span>{sp.category}</span>
          </div>
        </header>
        <p>{sp.summary}</p>
        <a className="more-link" href={sp.url} target="_blank" rel="noopener noreferrer">View project</a>
      </article>
    ))}

    {sortedArticles.map((article, idx) => (
      <article className="article-card" key={idx}>
        <header>
          <h2>{article.title}</h2>
          <div className="article-meta">
            <span>{article.date}</span>
            <span className="dot">•</span>
            <span>{article.readTime}</span>
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