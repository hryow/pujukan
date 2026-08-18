import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'
import SiteHeader from './SiteHeader.jsx'
import useSupabaseRecipes from '../hooks/useSupabaseRecipes.js'

export default function RecipesPage({
  recipes: recipesProp,
  loading: loadingProp,
  errorKey: errorKeyProp,
  errorMessage: errorMessageProp,
  maxItems,
  preview = false,
  showHeader = true,
  showFilters = true,
  showCardTags = true,
}) {
  const { t } = useTranslation()
  const [activeTags, setActiveTags] = useState([])
  const [expandedRecipeId, setExpandedRecipeId] = useState(null)
  const {
    recipes: loadedRecipes,
    loading: loadedLoading,
    errorKey: loadedErrorKey,
    errorMessage: loadedErrorMessage,
  } = useSupabaseRecipes()

  const recipes = recipesProp ?? loadedRecipes
  const loading = loadingProp ?? loadedLoading
  const errorKey = errorKeyProp ?? loadedErrorKey
  const errorMessage = errorMessageProp ?? loadedErrorMessage

  const visibleRecipes = useMemo(
    () => (typeof maxItems === 'number' ? (recipes ?? []).slice(0, maxItems) : recipes ?? []),
    [maxItems, recipes],
  )

  const availableTags = useMemo(
    () =>
      [...new Set(visibleRecipes.flatMap((recipe) => recipe.tags ?? []))].sort((left, right) =>
        left.localeCompare(right),
      ),
    [visibleRecipes],
  )

  const filteredRecipes = useMemo(() => {
    if (activeTags.length === 0) {
      return visibleRecipes
    }

    return visibleRecipes.filter((recipe) => activeTags.every((tag) => (recipe.tags ?? []).includes(tag)))
  }, [activeTags, visibleRecipes])

  useEffect(() => {
    if (!expandedRecipeId || preview) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setExpandedRecipeId(null)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedRecipeId, preview])

  const toggleTag = (tag) => {
    setActiveTags((currentTags) =>
      currentTags.includes(tag) ? currentTags.filter((currentTag) => currentTag !== tag) : [...currentTags, tag],
    )
  }

  const toggleRecipe = (recipeId) => {
    setExpandedRecipeId((currentRecipeId) => (currentRecipeId === recipeId ? null : recipeId))
  }

  const handleRecipeKeyDown = (event, recipeId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleRecipe(recipeId)
    }
  }

  const expandedRecipe = filteredRecipes.find((recipe) => recipe.id === expandedRecipeId) ?? null

  // Build the inner content first (status box or the real grid/overlay),
  // then wrap it with the header/shell exactly once at the end. This is
  // the key fix: previously the loading/error/empty branches returned
  // early and skipped SiteHeader/title entirely.
  let content

  if (loading) {
    content = <div className="gallery-box gallery-box--status">{t('recipes.loading')}</div>
  } else if (errorKey) {
    content = (
      <div className="gallery-box gallery-box--status">
        <div>{t(errorKey)}</div>
        {errorMessage ? <div className="gallery-box__detail">{errorMessage}</div> : null}
      </div>
    )
  } else if (visibleRecipes.length === 0) {
    content = <div className="gallery-box gallery-box--status">{t('recipes.empty')}</div>
  } else {
    content = (
      <div>
        {showFilters && !preview && availableTags.length > 0 ? (
          <div className="product-filter-bar" aria-label={t('recipes.filters.label')}>
            <div className="product-filter-bar__label">{t('recipes.filters.label')}</div>
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
                  {t('recipes.filters.clear')}
                </button>
              ) : null}
            </div>
            <div className="product-filter-bar__meta">
              {t('recipes.filters.showing', { visible: filteredRecipes.length, total: visibleRecipes.length })}
            </div>
          </div>
        ) : null}

        {filteredRecipes.length === 0 ? (
          <div className="gallery-box gallery-box--status">{t('recipes.filters.none')}</div>
        ) : (
          <div className="product-grid">
            {filteredRecipes.map((recipe) => (
              <article key={recipe.id} className="product-card recipe-card">
                <div
                  className={`product-card__surface${preview ? ' recipe-card__surface--preview' : ''}`}
                  role={preview ? undefined : 'button'}
                  tabIndex={preview ? undefined : 0}
                  onClick={preview ? undefined : () => toggleRecipe(recipe.id)}
                  onKeyDown={preview ? undefined : (event) => handleRecipeKeyDown(event, recipe.id)}
                  aria-expanded={preview ? undefined : expandedRecipeId === recipe.id}
                >
                  <div className="product-card__media">
                    {recipe.imageUrl ? (
                      <img src={recipe.imageUrl} alt={recipe.title} className="product-card__image" />
                    ) : (
                      <span>{recipe.title}</span>
                    )}
                  </div>
                  <div className="product-card__body recipe-card__body">
                    <h3 className="product-card__title">{recipe.title}</h3>
                    {showCardTags && recipe.tags?.length > 0 ? (
                      <div className="product-card__tags">
                        {recipe.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className={`tag-chip${activeTags.includes(tag) ? ' tag-chip--active' : ''}`}
                            onClick={(event) => {
                              event.stopPropagation()
                              toggleTag(tag)
                            }}
                            aria-pressed={activeTags.includes(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {expandedRecipe && !preview ? (
          <div className="product-overlay" role="presentation" onClick={() => setExpandedRecipeId(null)}>
            <div
              className="product-overlay__panel product-card"
              role="dialog"
              aria-modal="true"
              aria-label={expandedRecipe.title}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className="product-overlay__close" onClick={() => setExpandedRecipeId(null)}>
                Close
              </button>
              <div className="product-overlay__surface">
                <div className="product-card__media product-overlay__media">
                  {expandedRecipe.imageUrl ? (
                    <img src={expandedRecipe.imageUrl} alt={expandedRecipe.title} className="product-card__image" />
                  ) : (
                    <span>{expandedRecipe.title}</span>
                  )}
                </div>
                <div className="product-card__body product-overlay__body">
                  <h3 className="product-card__title product-overlay__title">{expandedRecipe.title}</h3>
                  {showCardTags && expandedRecipe.tags?.length > 0 ? (
                    <div className="product-card__tags">
                      {expandedRecipe.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className={`tag-chip${activeTags.includes(tag) ? ' tag-chip--active' : ''}`}
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleTag(tag)
                          }}
                          aria-pressed={activeTags.includes(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {expandedRecipe.ingredients ? (
                    <div className="recipe-detail__section">
                      <h4 className="recipe-detail__heading">{t('recipes.ingredients')}</h4>
                      <p className="product-card__description product-overlay__description recipe-detail__text">
                        {expandedRecipe.ingredients}
                      </p>
                    </div>
                  ) : null}
                  {expandedRecipe.steps ? (
                    <div className="recipe-detail__section">
                      <h4 className="recipe-detail__heading">{t('recipes.steps')}</h4>
                      <p className="product-card__description product-overlay__description recipe-detail__text">
                        {expandedRecipe.steps}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  if (!showHeader) {
    return content
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <section className="content-panel">
        <h1>{t('recipes.title')}</h1>
        <p>{t('recipes.description')}</p>
        {content}
      </section>
    </div>
  )
}