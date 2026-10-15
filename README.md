# Verbatim

Verbatim is a full-stack bookstore application for discovering books, managing a wishlist and cart, and placing orders with Razorpay checkout. The React storefront uses a warm, dark-academia visual theme.

## Features

- Customer registration, login, and logout
- Product browsing, category filtering, and search
- Product detail pages
- Persistent cart with quantity controls
- Wishlist management
- Shipping details and Razorpay payment checkout
- Order history and order detail pages

## Tech stack

- **Frontend:** React, Vite, React Router, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Payments:** Razorpay

## Requirements

- Node.js and npm
- MongoDB connection string
- Razorpay test API keys for checkout

## Setup

### 1. Configure the backend

Create a local environment file from the example:

```powershell
Copy-Item Backend\.env.example Backend\.env
```

Set these values in `Backend/.env`:

| Variable | Purpose |
| --- | --- |
| `dbURL` | MongoDB connection string |
| `jwt_secret` | Long, random secret used to sign authentication tokens |
| `RAZORPAY_KEY_ID` | Razorpay test key ID |
| `RAZORPAY_KEY_SECRET` | Matching Razorpay test key secret |

Do not commit `Backend/.env` or share its secret values. The `.env.example` file contains placeholders and is safe to commit.

Install backend dependencies and start the API:

```powershell
cd Backend
npm install
node index.js
```

The API listens on `http://localhost:8000`. The server currently allows the frontend origin `http://localhost:5173`.

### 2. Start the frontend

In a second terminal:

```powershell
cd Frontend\shopkart
npm install
npm run dev
```

Open the Vite URL printed in the terminal (by default, `http://localhost:5173`).

## Frontend commands

Run these commands from `Frontend/shopkart`:

```powershell
npm run dev      # Start the Vite development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run Oxlint
```

## API overview

The API base URL is configured as `http://localhost:8000` in `Frontend/shopkart/src/axioscalls/axios.js`.

| Route | Purpose |
| --- | --- |
| `/customers` | Registration, login, current customer, and logout |
| `/products` | Product listing, search/filter query, and product details |
| `/cart` | Authenticated cart retrieval and updates |
| `/wishlist` | Authenticated wishlist retrieval and updates |
| `/orders` | Authenticated order history, details, and payment endpoints |

Cart, wishlist, and order routes require an authenticated customer. Order checkout requires valid Razorpay test credentials.
