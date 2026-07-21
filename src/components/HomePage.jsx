import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../assets/pujukan_logo.png'
import SiteHeader from './SiteHeader.jsx'
import ProductGallery from './ProductGallery.jsx'
import useSupabaseProducts from '../hooks/useSupabaseProducts.js'

export default function HomePage() {
  const { t } = useTranslation()
  const { products, loading, errorKey, errorMessage } = useSupabaseProducts()

  return (
    <div id="homepage" className="page-shell">
      <SiteHeader />

      <div id="top" className="intro-panel">
        <div className="intro-text">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.description')}</p>
          <Link to="/products" className="button">
            {t('hero.cta')}
          </Link>
        </div>
      </div>

      <section id="products" className="content-panel">
        <h2>{t('products.title')}</h2>
        <ProductGallery products={products} loading={loading} errorKey={errorKey} errorMessage={errorMessage} />
        <Link to="/products" className="button">
          {t('hero.cta')}
        </Link>
      </section>

      <section id="recipes" className="content-panel">
        <h2>{t('recipes.title')}</h2>
        <div className="image-gallery">
          <div className="gallery-box">{t('recipes.items.bbq')}</div>
          <div className="gallery-box">{t('recipes.items.stew')}</div>
          <div className="gallery-box">{t('recipes.items.stirFry')}</div>
        </div>
        <Link to="/recipes" className="button">
          {t('hero.cta')}
        </Link>
      </section>

      <section id="about" className="content-panel">
        <h2>{t('about.title')}</h2>
        <p>{t('about.description')}</p>
      </section>

      <section id="contact" className="content-panel">
        <h2>{t('contact.title')}</h2>
        <p>{t('contact.description')}</p>
        <div className="contact-card">
          <a href="tel:+19095596792">{t('contact.phone')}</a>
          <a href="mailto:hello@pujukan.com">{t('contact.email')}</a>
          <a href="https://www.instagram.com/pujukan_ch/" target="_blank" rel="noreferrer">
            {t('contact.instagram')}
          </a>
        </div>
      </section>

      <div id="footer">
        <img id="logo" src={logo} alt="Logo" />
        <ul>
          <li>
            <Link to="/products">{t('nav.products')}</Link>
          </li>
          <li>
            <Link to="/recipes">{t('nav.recipes')}</Link>
          </li>
          <li>
            <Link to="/about">{t('nav.about')}</Link>
          </li>
          <li>
            <Link to="/contact">{t('nav.contact')}</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}