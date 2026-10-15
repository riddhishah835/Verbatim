# Verbatim — Full-Stack Bookstore

Verbatim is a full-stack bookstore application built with the MERN stack. It lets customers explore books, search and filter products, manage their shopping cart and wishlist, and place orders through Razorpay checkout.

The storefront features a warm, dark-academia-inspired visual theme.

**Live Demo:** https://verbatim-ebon-two.vercel.app

## Features

- **Authentication:** Customer registration, login, and logout
- **Book Discovery:** Browse products, search, filter by category, and view product details
- **Shopping Cart:** Manage cart items and quantities
- **Wishlist:** Save and manage favourite books
- **Checkout:** Enter shipping details and complete checkout using Razorpay test payments
- **Order Management:** View order history and individual order details

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Redux Toolkit, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Payments | Razorpay |
| Deployment | Vercel (frontend), Render (backend) |

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB connection string
- Razorpay test API credentials for checkout

### 1. Clone the repository

```bash
git clone https://github.com/riddhishah835/Verbatim.git
cd Verbatim
```

### 2. Configure the backend

From the project root, run this in PowerShell:

```powershell
Copy-Item Backend\.env.example Backend\.env
```

Add the following values to `Backend/.env`:

| Variable | Purpose |
|---|---|
| `dbURL` | MongoDB connection string |
| `jwt_secret` | Strong, randomly generated authentication secret |
| `RAZORPAY_KEY_ID` | Razorpay test key ID |
| `RAZORPAY_KEY_SECRET` | Matching Razorpay test key secret |

Use the variable names expected by the backend code. Never commit `.env` files or expose secret values.

Install dependencies and start the API:

```bash
cd Backend
npm install
node index.js
```

The backend runs at `http://localhost:8000` with the current local configuration.

### 3. Configure and start the frontend

Open a **second terminal** from the repository root:

```bash
cd Frontend/shopkart
npm install
```

The frontend API client currently uses `http://localhost:8000`. If the API URL is configured through an environment variable in your code, set it to the local backend URL for local development.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 4. Frontend scripts

Run these from `Frontend/shopkart`:

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## API Overview

| Route | Purpose |
|---|---|
| `/customers` | Customer registration, login, current-user details, and logout |
| `/products` | Product listing, search, filtering, and product details |
| `/cart` | Authenticated cart retrieval and updates |
| `/wishlist` | Authenticated wishlist retrieval and updates |
| `/orders` | Authenticated order history, order details, and payment-related operations |

Cart, wishlist, and order operations require an authenticated customer. Checkout requires valid Razorpay test credentials.

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

The deployed application uses environment variables for configuration. Local development uses the local backend URL; the deployed frontend must use the deployed API URL.

## Security Notes

- Keep database credentials, JWT secrets, and payment secrets private.
- Do not commit `.env` files.
- Use Razorpay test mode for development and testing.
- Never put secret keys in frontend code.
