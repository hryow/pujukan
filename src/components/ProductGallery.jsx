import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProductGallery({ products, loading, errorKey, errorMessage, maxItems, showFilters = true }) {
  const { t } = useTranslation()
  const [activeTags, setActiveTags] = useState([])
  const visibleProducts = useMemo(
    () => (typeof maxItems === 'number' ? products.slice(0, maxItems) : products),
    [maxItems, products],
  )

  const availableTags = useMemo(
    () =>
      [...new Set(visibleProducts.flatMap((product) => product.tags ?? []))].sort((left, right) =>
        left.localeCompare(right),
      ),
    [visibleProducts],
  )

  const filteredProducts = useMemo(() => {
    if (activeTags.length === 0) {
      return visibleProducts
    }

    return visibleProducts.filter((product) => activeTags.every((tag) => (product.tags ?? []).includes(tag)))
  }, [activeTags, visibleProducts])

  const toggleTag = (tag) => {
    setActiveTags((currentTags) =>
      currentTags.includes(tag) ? currentTags.filter((currentTag) => currentTag !== tag) : [...currentTags, tag],
    )
  }

  if (loading) {
    return <div className="gallery-box gallery-box--status">{t('products.loading')}</div>
  }

  if (errorKey) {
    return (
      <div className="gallery-box gallery-box--status">
        <div>{t(errorKey)}</div>
        {errorMessage ? <div className="gallery-box__detail">{errorMessage}</div> : null}
      </div>
    )
  }

  if (visibleProducts.length === 0) {
    return <div className="gallery-box gallery-box--status">{t('products.empty')}</div>
  }

  return (
    <div>
      {showFilters && availableTags.length > 0 ? (
        <div className="product-filter-bar" aria-label={t('products.filters.label')}>
          <div className="product-filter-bar__label">{t('products.filters.label')}</div>
          <div className="product-filter-bar__chips">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-chip${activeTags.includes(tag) ? ' tag-chip--active' : ''}`}
                onClick={() => toggleTag(tag)}
                aria-pressed={activeTags.includes(tag)}
              >
                {tag}
              </button>
            ))}
            {activeTags.length > 0 ? (
              <button type="button" className="tag-chip tag-chip--clear" onClick={() => setActiveTags([])}>
                {t('products.filters.clear')}
              </button>
            ) : null}
          </div>
          <div className="product-filter-bar__meta">
            {t('products.filters.showing', { visible: filteredProducts.length, total: visibleProducts.length })}
          </div>
        </div>
      ) : null}

      {filteredProducts.length === 0 ? (
        <div className="gallery-box gallery-box--status">{t('products.filters.none')}</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-card__media">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="product-card__image" />
                ) : (
                  <span>{product.title}</span>
                )}
              </div>
              <div className="product-card__body">
                <h3 className="product-card__title">{product.title}</h3>
                {showFilters && product.tags?.length > 0 ? (
                  <div className="product-card__tags">
                    {product.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`tag-chip${activeTags.includes(tag) ? ' tag-chip--active' : ''}`}
                        onClick={() => toggleTag(tag)}
                        aria-pressed={activeTags.includes(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}