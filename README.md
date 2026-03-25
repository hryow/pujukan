# Pujukan
This is a website for a meat retailer called Pujukan. 

# Table of Contents
- [Setup](#setup)
- [Features](#features)
- [Tech Stack](#tech-stack) 

# Setup
To run the Pujukan application locally, you must run the databases, the backend server, and the frontend storefront simultaneously.

### 1. Prerequisites
- Node.js (v20+ LTS)
- Docker Desktop
- Stripe Developer Account (for API keys)
- Shippo Developer Account (for API keys)

### 2. Start the Databases
Pujukan relies on PostgreSQL for persistent data and Redis for caching and background jobs. Start them using Docker:
```bash
docker-compose up -d
```

### 3. Initialize the Medusa Backend
Navigate to the backend directory, install dependencies, and start the Medusa server:
```bash
cd backend
npm install
```

Rename the .env.template to .env and add your keys:

```text
DATABASE_URL=postgres://user:password@localhost:5432/pujukan
REDIS_URL=redis://localhost:6379
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SHIPPO_API_KEY=shippo_test_...
```
Seed the database and start the server:

```bash
npx medusa seed --seed-file=data/seed.json
npm run dev
```
The backend now runs on http://localhost:9000 and the Admin panel on http://localhost:7001.

### 4. Initialize the Next.js Storefront
Open a new terminal, navigate to the storefront directory, and install dependencies:

```bash
cd storefront
npm install
```
Rename the .env.template to .env.local and link to the backend:

```text
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
```
Start the frontend development server:
```bash
npm run dev
```
The storefront is now live at http://localhost:8000.

# Features
- **Catch-Weight Pricing:** Supports two-step payment authorization. A temporary hold is placed on the customer's card at checkout, and the final exact amount is captured only after the meat is cut and weighed.

- **Automated Logistics & Routing:** Integrated with Shippo to automatically generate shipping labels for cold-chain boxes based on final fulfillment weights.

- **Headless Storefront:** Blazing fast, SEO-optimized frontend using Next.js, completely decoupled from the backend logic.

- **Perishable Inventory Management:** Tracks expiry lots and auto-decrements real-time stock to prevent overselling limited, high-demand cuts.

- **Custom Admin Dashboard:** A centralized portal for butchers and dispatchers to manage variable pricing updates, orders, and delivery schedules.

# Tech Stack 
### Frontend
- **Next.js (React):** Handles the main storefront and SSR features for fast load times.

- **Tailwind CSS:** Manages the responsive, custom UI design.

- **Medusa React Client:** Communicates securely with the headless backend.
### Backend
- **MedusaJS (Node.js):** The core open-source headless commerce engine managing carts, orders, and inventory.

- **Stripe API:** Handles secure, two-step Auth & Capture payments.

- **Shippo API:** Handles the fulfillment pipeline and carrier integrations.
### Database
- **PostgreSQL:** The primary relational database for users, products, categories, and order histories.

- **Redis:** Manages the event bus, queuing webhook events (like Stripe notifications), and cart caching.
