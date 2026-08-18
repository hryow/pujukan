import { useTranslation } from 'react-i18next'
import { useSupabaseTable } from './useSupabaseTable.js'

const RECIPES_TABLE = import.meta.env.VITE_SUPABASE_RECIPES_TABLE || 'recipes'

function toSortableNumber(value) {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

function getImageUrl(row) {
  const imageUrl = row.image_path ?? row.image_url ?? row.imageUrl ?? ''
  return typeof imageUrl === 'string' ? imageUrl.trim() : ''
}

function normalizeRecipe(row, index, isKorean) {
  const meatType = isKorean
    ? String(row.kor_meat_type ?? '').trim()
    : String(row.en_meat_type ?? '').trim()
  const ingredients = isKorean
    ? String(row.kor_ingredients ?? '').trim()
    : String(row.en_ingredients ?? '').trim()
  const steps = isKorean ? String(row.kor_steps ?? '').trim() : String(row.en_steps ?? '').trim()

  return {
    id: row.id,
    title: isKorean ? row.kor_recipe_name ?? `Recipe ${index + 1}` : row.en_recipe_name ?? `Recipe ${index + 1}`,
    meatType,
    tags: meatType ? [meatType] : [],
    ingredients,
    steps,
    imageUrl: getImageUrl(row),
    sortOrder: toSortableNumber(row.product_id),
    createdAt: null,
  }
}

function sortRecipes(recipes) {
  return [...recipes].sort((left, right) => {
    if (left.sortOrder !== null || right.sortOrder !== null) {
      const leftOrder = left.sortOrder ?? Number.POSITIVE_INFINITY
      const rightOrder = right.sortOrder ?? Number.POSITIVE_INFINITY
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder
      }
    }

    if (left.createdAt || right.createdAt) {
      const leftDate = left.createdAt ? new Date(left.createdAt).getTime() : 0
      const rightDate = right.createdAt ? new Date(right.createdAt).getTime() : 0
      if (leftDate !== rightDate) {
        return rightDate - leftDate
      }
    }

    return left.title.localeCompare(right.title)
  })
}

export default function useSupabaseRecipes() {
  const { i18n } = useTranslation()
  const isKorean = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('ko')

  const { items, loading, errorKey, errorMessage, tableName } = useSupabaseTable(
    RECIPES_TABLE,
    (row, index) => normalizeRecipe(row, index, isKorean),
    sortRecipes,
    [isKorean],
  )

  return { recipes: items, loading, errorKey, errorMessage, tableName }
}