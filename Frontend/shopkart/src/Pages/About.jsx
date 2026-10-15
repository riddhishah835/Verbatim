import React from 'react'
import Navbar from '../components/Navbar'

function About() {
  return (
    <div className="page">
      <Navbar />
      <main className="main-content">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 className="home-title">About Verbatim</h1>
          <p className="home-subtitle" style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Verbatim is a modern bookstore built for readers who love finding their next favorite title.
            Explore a considered collection of books and keep your reading list close.
          </p>
        </div>
      </main>
    </div>
  )
}

export default About