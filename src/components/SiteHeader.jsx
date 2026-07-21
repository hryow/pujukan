import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../assets/pujukan_logo.png'

export default function SiteHeader() {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage || 'en'

  return (
    <div id="navbar">
      <Link to="/">
        <img id="logo" src={logo} alt="Pujukan logo" />
      </Link>
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
      <div className="language-switcher" aria-label={t('language.label')}>
        <button type="button" onClick={() => i18n.changeLanguage('en')} aria-pressed={currentLanguage === 'en'}>
          EN
        </button>
        <button type="button" onClick={() => i18n.changeLanguage('ko')} aria-pressed={currentLanguage === 'ko'}>
          한국어
        </button>
      </div>
    </div>
  )
}