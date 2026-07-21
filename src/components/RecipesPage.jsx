import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SiteHeader from './SiteHeader.jsx'

export default function RecipesPage() {
  const { t } = useTranslation()

  return (
    <div className="page-shell">
      <SiteHeader />
      <section className="content-panel">
        <h1>{t('recipes.title')}</h1>
        <p>{t('recipes.items.bbq')}</p>
        <div className="image-gallery">
          <div className="gallery-box">{t('recipes.items.bbq')}</div>
          <div className="gallery-box">{t('recipes.items.stew')}</div>
          <div className="gallery-box">{t('recipes.items.stirFry')}</div>
        </div>
      </section>
    </div>
  )
}