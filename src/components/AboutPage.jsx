import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase.js'
import SiteHeader from './SiteHeader.jsx'

export default function AboutPage() {
  const { t } = useTranslation()
  const supabaseReady = Boolean(supabase)

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