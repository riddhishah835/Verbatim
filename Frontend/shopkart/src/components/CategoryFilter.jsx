import React from 'react'

function CategoryFilter({ categories, selectedCategory, onChange }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
        aria-pressed={selectedCategory === 'all'}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onChange(category)}
          aria-pressed={selectedCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter