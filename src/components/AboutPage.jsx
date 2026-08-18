import { useTranslation } from 'react-i18next'
import SiteHeader from './SiteHeader.jsx'

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="page-shell">
      <SiteHeader />
      <section className="content-panel">
        <h1>{t('about.title')}</h1>
        <p>{t('about.description')}</p>
      </section>
    </div>
  )
}