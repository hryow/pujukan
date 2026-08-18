import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useInstagramPosts from '../hooks/useInstagramPosts.js'

const CAPTION_PREVIEW_LENGTH = 100

function formatPublishedDate(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function previewText(value, maxLength = CAPTION_PREVIEW_LENGTH) {
  if (!value) {
    return ''
  }

  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trimEnd()}...`
}

export default function InstagramSection() {
  const { t } = useTranslation()
  const { posts, loading, errorMessage, profileUrl } = useInstagramPosts()
  const stripRef = useRef(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const visiblePosts = useMemo(() => posts.slice(0, 8), [posts])

  useEffect(() => {
    const stripElement = stripRef.current
    if (!stripElement || visiblePosts.length === 0) {
      setCanScrollPrev(false)
      setCanScrollNext(false)
      return
    }

    const updateArrowState = () => {
      const { scrollLeft, clientWidth, scrollWidth } = stripElement
      setCanScrollPrev(scrollLeft > 2)
      setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 2)
    }

    updateArrowState()
    stripElement.addEventListener('scroll', updateArrowState)
    window.addEventListener('resize', updateArrowState)

    return () => {
      stripElement.removeEventListener('scroll', updateArrowState)
      window.removeEventListener('resize', updateArrowState)
    }
  }, [visiblePosts.length])

  const handleSlide = (direction) => {
    const stripElement = stripRef.current
    if (!stripElement) {
      return
    }

    stripElement.scrollBy({
      left: direction * Math.max(stripElement.clientWidth * 0.82, 260),
      behavior: 'smooth',
    })
  }

  return (
    <section id="instagram" className="content-panel instagram-section">
      <div className="instagram-section__header">
        <div>
          <h2>{t('instagram.title')}</h2>
        </div>
      </div>

      {loading ? (
        <div className="instagram-strip instagram-strip--status">{t('instagram.loading')}</div>
      ) : errorMessage ? (
        <div className="instagram-strip instagram-strip--status">
          <div>{t('instagram.error')}</div>
          <div className="gallery-box__detail">{errorMessage}</div>
          <a href={profileUrl} target="_blank" rel="noreferrer" className="button">
            {t('instagram.viewProfile')}
          </a>
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="instagram-strip instagram-strip--status">
          <div>{t('instagram.empty')}</div>
          <a href={profileUrl} target="_blank" rel="noreferrer" className="button">
            {t('instagram.viewProfile')}
          </a>
        </div>
      ) : (
        <div className="instagram-carousel">
          <button
            type="button"
            className="instagram-carousel__arrow"
            onClick={() => handleSlide(-1)}
            disabled={!canScrollPrev}
            aria-label={t('instagram.previous')}
          >
            {'<'}
          </button>
          <div ref={stripRef} className="instagram-strip" aria-label={t('instagram.title')}>
            {visiblePosts.map((post) => {
              const captionPreview = previewText(post.description)

              return (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="instagram-card"
                  aria-label={captionPreview ? `${t('instagram.title')} - ${captionPreview}` : t('instagram.title')}
                >
                  <div className="instagram-card__media">
                    <img src={post.imageUrl} alt={captionPreview || t('instagram.title')} className="instagram-card__image" loading="lazy" />
                  </div>
                  <div className="instagram-card__body">
                   
                    {captionPreview ? <p className="instagram-card__caption">{captionPreview}</p> : null}
                    {formatPublishedDate(post.publishedAt) ? (
                      <div className="instagram-card__date">{formatPublishedDate(post.publishedAt)}</div>
                    ) : null}
                  </div>
                </a>
              )
            })}
          </div>
          <button
            type="button"
            className="instagram-carousel__arrow"
            onClick={() => handleSlide(1)}
            disabled={!canScrollNext}
            aria-label={t('instagram.next')}
          >
            {'>'}
          </button>
        </div>
      )}
    </section>
  )
}