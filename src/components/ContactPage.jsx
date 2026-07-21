import { useTranslation } from 'react-i18next'
import SiteHeader from './SiteHeader.jsx'

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <div className="page-shell">
      <SiteHeader />
      <section className="content-panel">
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.description')}</p>
        <div className="contact-card">
          <a href="tel:+19095596792">{t('contact.phone')}</a>
          <a href="mailto:hello@pujukan.com">{t('contact.email')}</a>
          <a href="https://www.instagram.com/pujukan_ch/" target="_blank" rel="noreferrer">
            {t('contact.instagram')}
          </a>
        </div>
      </section>
    </div>
  )
}