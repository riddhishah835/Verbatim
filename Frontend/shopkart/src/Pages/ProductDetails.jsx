import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import axiosInstance from "../axioscalls/axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";

function ProductDetails() {
  const [product, setproduct] = useState(null);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [loading, setloading] = useState(true);
  const [err, seterr] = useState("");
  const [cartError, setCartError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  useEffect(() => {
    const fetchProd = async () => {
      try {
        setloading(true);
        seterr("");
        const res = await axiosInstance.get(`/products/${id}`);
        setproduct(res.data.data);
      } catch (err) {
        console.error(err);
        seterr(err);
      } finally {
        setloading(false);
      }
    };
    fetchProd();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        {" "}
        <Navbar />{" "}
        <main className="main-content">
          {" "}
          <div className="container">
            {" "}
            <div className="empty-state">
              {" "}
              <h3>Loading product...</h3>{" "}
            </div>{" "}
          </div>{" "}
        </main>{" "}
      </div>
    );
  }

  if (err||!product) {
    return (
      <div className="page">
        <Navbar />
        <main className="main-content">
          <div className="container">
            <div className="product-details">
              <div className="empty-state">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 17" />
                </svg>
                <h3>Product not found</h3>
                <p>The product you're looking for doesn't exist.</p>
                <Link to="/Products" className="btn btn-primary">
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const availableStock = Math.max(0, product.stock - (cartItem?.quantity || 0));
  const inStock = availableStock > 0;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(availableStock, prev + delta)));
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setCartError("");
    try {
      for (let count = 0; count < quantity; count += 1) {
        await dispatch(addToCart(product._id));
      }
    } catch (requestError) {
      setCartError(requestError.response?.data?.message || "Unable to add product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="page">
      <Navbar />
      <main className="main-content">
        <div className="container">
       
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/Home">Home</Link>
              </li>
              <li>
                <Link to="/Products">Products</Link>
              </li>
              <li>
                <Link to="/Products">{product.category}</Link>
              </li>
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <div className="product-details">
            
            <div className="product-gallery">
              <div className="main-image">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    id="main-product-image"
                  />
                ) : (
                  <div className="product-placeholder large" aria-hidden="true">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 17" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section - Full Width */}
            <div className="product-info-detail">
              <span className="product-category">{product.category}</span>

              <h1 className="product-name-detail">{product.name}</h1>

              <div className="product-price-detail">
                <span className="current-price">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>

              <div className="product-stock">
                {inStock ? (
                  <span className="in-stock">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {availableStock} units left
                  </span>
                ) : (
                  <span className="out-of-stock">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              <div className="product-meta">
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>
                  <strong>Available since:</strong>{" "}
                  {formatDate(product.createdAt)}
                </p>
              </div>

              <div className="quantity-selector">
                <label htmlFor="quantity" className="quantity-label">
                  Quantity
                </label>
                <div className="quantity-input">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            availableStock,
                            parseInt(e.target.value) || 1,
                          ),
                        ),
                      )
                    }
                    min="1"
                    max={availableStock}
                    className="qty-value"
                    disabled={!inStock}
                  />
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= availableStock}
                    aria-label="Increase quantity"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="btn btn-secondary btn-lg add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!inStock || addingToCart}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                  </svg>
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  className="btn btn-primary btn-lg buy-now-btn"
                  onClick={() => alert(`Buying ${quantity} item(s)!`)}
                  disabled={!inStock}
                >
                  Buy Now
                </button>
              </div>
              {cartError && <p className="form-error" role="alert">{cartError}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;
