import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Mail, Github, Calendar, Tag, Search } from 'lucide-react';

const Core = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample articles data - replace with your actual articles
  const articles = [
    {
      id: 1,
      title: "The Future of Web Development: Trends to Watch in 2025",
      excerpt: "Exploring the latest trends shaping the web development landscape, from AI integration to performance optimization.",
      date: "2024-12-15",
      readTime: "8 min read",
      tags: ["Web Development", "Technology", "AI"]
    },
    {
      id: 2,
      title: "Building Scalable React Applications",
      excerpt: "A comprehensive guide to structuring React applications for long-term maintainability and performance.",
      date: "2024-11-28",
      readTime: "12 min read",
      tags: ["React", "JavaScript", "Architecture"]
    },
    {
      id: 3,
      title: "The Art of Technical Writing",
      excerpt: "How to communicate complex technical concepts clearly and effectively to diverse audiences.",
      date: "2024-11-10",
      readTime: "6 min read",
      tags: ["Writing", "Communication", "Documentation"]
    },
    {
      id: 4,
      title: "Minimalism in Design: Less is More",
      excerpt: "Why minimalist design principles create better user experiences and how to implement them effectively.",
      date: "2024-10-22",
      readTime: "5 min read",
      tags: ["Design", "UX", "Minimalism"]
    },
    {
      id: 5,
      title: "Open Source Contribution Guide",
      excerpt: "A beginner's guide to contributing to open source projects and building your developer portfolio.",
      date: "2024-10-08",
      readTime: "10 min read",
      tags: ["Open Source", "Career", "Development"]
    }
  ];

  // Sample projects data - replace with your actual projects
  const projects = [
    {
      id: 1,
      title: "TaskFlow - Project Management Tool",
      description: "A minimalist project management application built with React and Node.js, featuring real-time collaboration and clean UI design.",
      tech: ["React", "Node.js", "MongoDB", "Socket.io"],
      link: "#",
      github: "#"
    },
    {
      id: 2,
      title: "ReadTracker - Reading Progress App",
      description: "A personal reading tracker that helps users manage their reading goals and discover new books through a clean, distraction-free interface.",
      tech: ["React Native", "Firebase", "TypeScript"],
      link: "#",
      github: "#"
    },
    {
      id: 3,
      title: "CodeSnippet Manager",
      description: "A developer tool for organizing and sharing code snippets with syntax highlighting and tagging system.",
      tech: ["Vue.js", "Express", "PostgreSQL"],
      link: "#",
      github: "#"
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-100">Your Name</h1>
          <div className="flex space-x-8">
            {['home', 'projects', 'about'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`capitalize text-sm font-medium transition-all duration-200 ${
                  activeSection === section 
                    ? 'text-gray-100 border-b-2 border-gray-300 pb-1' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {section}
              </button>
            ))}
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-1"
            >
              LinkedIn <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );

  const HomeSection = () => (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-100 mb-4">Welcome to My Corner of the Web</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          I write about technology, design, and the intersection of creativity and code.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-100">Latest Articles</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 transition-colors text-gray-100 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <article key={article.id} className="border-b border-gray-700/50 pb-6 hover:bg-gray-800/30 p-4 rounded-lg transition-all duration-200 cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xl font-semibold text-gray-100 group-hover:text-gray-200 transition-colors">{article.title}</h4>
              <div className="flex items-center text-sm text-gray-500 gap-4 flex-shrink-0 ml-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(article.date).toLocaleDateString()}
                </span>
                <span>{article.readTime}</span>
              </div>
            </div>
            <p className="text-gray-400 mb-3 leading-relaxed">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={14} className="text-gray-500" />
                {article.tags.map((tag, index) => (
                  <span key={index} className="text-sm text-gray-400 bg-gray-800 border border-gray-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <ArrowRight size={16} className="text-gray-500 group-hover:text-gray-400 transition-colors" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const ProjectsSection = () => (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">Projects</h2>
        <p className="text-lg text-gray-400">A collection of things I've built and experimented with.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-200 group">
            <h3 className="text-xl font-semibold text-gray-100 mb-3 group-hover:text-gray-200 transition-colors">{project.title}</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, index) => (
                  <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <a href={project.link} className="text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors flex items-center gap-1">
                View Project <ExternalLink size={14} />
              </a>
              <a href={project.github} className="text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                <Github size={14} /> Code
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AboutSection = () => (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-100 mb-4">About Me</h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-lg text-gray-300 leading-relaxed space-y-4">
          <p>
            Hello! I'm a passionate developer and writer who loves exploring the intersection of technology and creativity. 
            With a background in software engineering and a keen eye for design, I enjoy building tools that make people's lives easier.
          </p>
          
          <p>
            When I'm not coding, you'll find me writing about the latest trends in web development, experimenting with new technologies, 
            or contributing to open source projects. I believe in the power of clean, minimalist design and the importance of 
            writing maintainable, scalable code.
          </p>
          
          <p>
            My approach to development is simple: focus on the user experience, write clean code, and never stop learning. 
            I'm always excited to collaborate on interesting projects and share knowledge with the developer community.
          </p>
        </div>

        <div className="border-t border-gray-700/50 pt-8">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Skills & Interests</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-200 mb-2">Technical Skills</h4>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS'].map((skill) => (
                  <span key={skill} className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded border border-gray-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-200 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {['UI/UX Design', 'Technical Writing', 'Open Source', 'Minimalism', 'Photography'].map((interest) => (
                  <span key={interest} className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded border border-gray-700">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Let's Connect</h3>
          <div className="flex justify-center gap-6">
            <a href="mailto:your.email@example.com" className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
              <Mail size={18} />
              <span>Email</span>
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
              <Github size={18} />
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
              <ExternalLink size={18} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'about':
        return <AboutSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        {renderSection()}
      </main>

      <footer className="border-t border-gray-700/50 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-500">
          <p>&copy; 2025 Your Name. Built with care and minimalism in mind.</p>
        </div>
      </footer>
    </div>
  );
};

export default Core;
