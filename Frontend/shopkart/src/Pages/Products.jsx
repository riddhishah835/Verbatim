import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'

import axiosInstance from '../axioscalls/axios'



function Products() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [product,setproduct]=useState([])
  const [categories,setcategories]=useState([])
  const [wishlistIds,setWishlistIds]=useState([])
  const [wishlistReady,setWishlistReady]=useState(false)
  const [loading,setloading]=useState(true)
  const[error,seterror]=useState("")
useEffect(() => { const fetchCategories = async () => { try {
  
const response = await axiosInstance.get('/products') 
const products = response.data.products || []
 
   const uniqueCategories = [ ...new Set( products.map((product) => product.category) ) ] 
   setcategories(uniqueCategories) } 
   catch (err) { console.error(err) } } 
   fetchCategories() }, [])

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get('/wishlist')
        setWishlistIds(response.data.wishlist.map((item) => item._id))
      } catch (err) {
        console.error('Unable to load wishlist status:', err)
      } finally {
        setWishlistReady(true)
      }
    }
    fetchWishlist()
  }, [])

  const updateWishlist = (productId, saved) => {
    setWishlistIds((currentIds) => saved
      ? [...new Set([...currentIds, productId])]
      : currentIds.filter((id) => id !== productId))
  }

  useEffect(()=>{


    const fetchproducts=async()=>{
      try{
       setloading(true)
       seterror('')
        const params={}
        if(searchQuery.trim()){
          params.search=searchQuery.trim()
        }
        if(selectedCategory!=='all')
        {
          params.category=selectedCategory
        }
        const prod=await axiosInstance.get('/products',{params:params})
       
          setproduct(prod.data.products)
        
      }
      catch(err){
     console.log(err)
     seterror(err.response?.data?.message || 'Unable to load products.')
      }
      finally{
        setloading(false)
      }
    } 
    fetchproducts()
  },[searchQuery,selectedCategory])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  
  return (
    <div className="page">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="home-title">Products</h1>
            <p className="home-subtitle">Discover our collection of products</p>
          </div>
          <div className="product-listing">
            <div className="listing-header">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={handleCategoryChange}
              />
            </div>

            {loading && <p role="status">Loading products...</p>}
            {error && <p className="form-error" role="alert">{error}</p>}

            {!loading && !error && <div className="products-grid" role="list" aria-label="Products">
              {product.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product._id)}
                  wishlistReady={wishlistReady}
                  onWishlistChange={updateWishlist}
                />
              ))}
            </div>}

            {!loading && !error && product.length === 0 && (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 17" />
                </svg>
                <h3>No products found</h3>
                <p>
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No products available at the moment'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button className="btn btn-secondary" onClick={() => { handleSearchChange({ target: { value: '' } }); handleCategoryChange('all'); }}>
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Products