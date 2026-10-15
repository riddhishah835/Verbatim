import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Home() {

  return (
    <div className="page">
      <Navbar />
      <main className="main-content">
        <section className="library-hero">
          <div className="hero-background">
            <div className="bookshelf-silhouette">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shelf-row">
                  {[...Array(5)].map((_, j) => {
                    const colors = ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f']
                    const darkColors = ['#b45309', '#92400e', '#78350f', '#451a03', '#1c0d02']
                    const c1 = colors[Math.floor(Math.random() * 5)]
                    const c2 = darkColors[Math.floor(Math.random() * 5)]
                    const angle = 90 + Math.random() * 30
                    const height = 25 + Math.random() * 35
                    return (
                      <div 
                        key={j} 
                        className="book-spine"
                        style={{ 
                          height: `${height}px`,
                          background: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
                          animationDelay: `${i * 0.1 + j * 0.05}s`
                        }} 
                      ></div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="container hero-content">
            <div className="hero-text">
              <div className="hero-badge">Welcome to Verbatim Books</div>
              <h1 className="hero-title">
                <span className="title-line">Curated Books</span>
                <span className="title-line">For Every Reader</span>
              </h1>
              <p className="hero-description">
                Browse our carefully organized shelves of quality books. 
                Each title is selected, categorized, and presented like a well-ordered library.
              </p>
              <div className="hero-actions">
                <Link to="/Products" className="btn btn-primary btn-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                  Explore Books
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

export default Home