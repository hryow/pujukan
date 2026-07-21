import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage.jsx'
import AboutPage from './components/AboutPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import ProductsPage from './components/ProductsPage.jsx'
import RecipesPage from './components/RecipesPage.jsx'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
