import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SiteHeader from './SiteHeader.jsx'
import ProductGallery from './ProductGallery.jsx'
import useSupabaseProducts from '../hooks/useSupabaseProducts.js'

export default function ProductsPage() {
  const { t } = useTranslation()
  const { products, loading, errorKey, errorMessage } = useSupabaseProducts()

  return (
    <div className="page-shell">
      <SiteHeader />
      <section className="content-panel">
        <h1>{t('products.title')}</h1>
        <p>{t('hero.description')}</p>
        <ProductGallery products={products} loading={loading} errorKey={errorKey} errorMessage={errorMessage} />
      </section>
    </div>
  )
}