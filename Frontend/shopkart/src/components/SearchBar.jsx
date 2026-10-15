import React from 'react'

function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="search-bar">
      <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search products"
      />
    </div>
  )
}

export default SearchBar