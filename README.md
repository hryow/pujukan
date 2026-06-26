# Pujukan 🥩

A website for **Pujukan**, a meat retailer, built to showcase available meat offerings and allow the owner to manage them through a simple admin panel — no technical knowledge required.

***

## Overview

Pujukan is a full-stack web application consisting of:

- A **public-facing menu** where customers can browse available meat offerings
- A **password-protected admin panel** where the owner can add, edit, and delete meat offerings with ease
- A **REST API** powered by Node.js and Express that handles all data operations
- A **PostgreSQL database** for persistent, server-side storage of all offerings

***

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |

***

## Project Structure

```
pujukan/
├── client/                  # Frontend
│   ├── index.html           # Public menu page
│   ├── admin.html           # Owner admin panel
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── menu.js          # Fetches and renders offerings
│       └── admin.js         # Handles CRUD operations via API
│
├── server/                  # Backend
│   ├── index.js             # Express app entry point
│   ├── routes/
│   │   └── offerings.js     # CRUD routes for meat offerings
│   ├── controllers/
│   │   └── offerings.js     # Route logic
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   └── db/
│       ├── index.js         # PostgreSQL connection
│       └── schema.sql       # Database schema
│
├── .env                     # Environment variables (not committed)
├── .env.example             # Example environment config
├── package.json
└── README.md
```

***

## Features

### Public Menu
- Displays all available meat offerings (name, cut, price, description, image)
- Dynamically rendered from the database via the REST API
- Fully responsive for mobile and desktop

### Admin Panel
- Password-protected login using JWT authentication
- **Create** — Add a new meat offering via a simple form
- **Read** — View all current offerings in a dashboard table
- **Update** — Edit any offering's details inline
- **Delete** — Remove an offering with a confirmation prompt

***

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/offerings` | Get all meat offerings | No |
| `GET` | `/api/offerings/:id` | Get a single offering | No |
| `POST` | `/api/offerings` | Create a new offering | ✅ Yes |
| `PUT` | `/api/offerings/:id` | Update an offering | ✅ Yes |
| `DELETE` | `/api/offerings/:id` | Delete an offering | ✅ Yes |
| `POST` | `/api/auth/login` | Owner login, returns JWT | No |

***

## Database Schema

```sql
CREATE TABLE offerings (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  cut         VARCHAR(255),
  price       VARCHAR(100),
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

***

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (v14+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hryow/pujukan.git
   cd pujukan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/pujukan
   JWT_SECRET=your_secret_key_here
   ADMIN_PASSWORD=owner_password_here
   ```

4. **Set up the database**
   ```bash
   psql -U your_user -d pujukan -f server/db/schema.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

***

## Deployment

This project is suited for deployment on platforms that support Node.js and PostgreSQL:

- **[Railway](https://railway.app/)** — Recommended: deploys both Node.js and PostgreSQL together with minimal configuration
- **[Render](https://render.com/)** — Free tier available for Node.js apps with managed PostgreSQL
- **[Fly.io](https://fly.io/)** — More control with a generous free tier

***

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `ADMIN_PASSWORD` | Password for the owner's admin login |

***

## License

This project is private and intended for use by Pujukan only.
