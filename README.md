# Pujukan

Pujukan is a React + Vite storefront site for a meat retailer. The homepage keeps the original single-page layout, and the navbar items now also open their own dedicated routes for products, recipes, about, and contact.

## What’s In The Repo

- A bilingual UI in English and Korean using `react-i18next`
- A routed app shell using `react-router-dom`
- A homepage that still shows the hero section and section summaries for products, recipes, about, and contact
- Dedicated pages for each navbar item
- Optional Supabase client wiring that becomes available when the expected environment variables are present

## Routes

- `/` - homepage
- `/products` - products page
- `/recipes` - recipes page
- `/about` - about page
- `/contact` - contact page

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JSX, CSS |
| Routing | react-router-dom |
| i18n | react-i18next, i18next, i18next-browser-languagedetector |
| Backend client | Supabase JS client |

## Project Structure

```bash
pujukan/
├── media/
├── public/
├── src/
│   ├── assets/
│   │   └── pujukan_logo.png
│   ├── components/
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── RecipesPage.jsx
│   │   └── SiteHeader.jsx
│   ├── locales/
│   │   ├── en/
│   │   │   └── translation.json
│   │   └── ko/
│   │       └── translation.json
│   ├── App.jsx
│   ├── App.css
│   ├── i18n.js
│   ├── index.css
│   ├── main.jsx
│   └── supabase.js
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Local Development

```bash
npm install
npm run dev
```

The app runs locally with Vite, usually at `http://localhost:5173`.

## Build And Checks

```bash
npm run build
npm run lint
```

## Environment Variables

`src/supabase.js` only creates a Supabase client when both variables are present:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If they are missing, the app still runs and the About page shows the missing-config state.

## Notes

- The homepage content is still rendered on `/`.
- Navbar links use client-side routing instead of hash anchors.
- Translation content lives in `src/locales/en/translation.json` and `src/locales/ko/translation.json`.

## License

Private project for Pujukan.
