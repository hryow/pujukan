import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase.js'

const PRODUCTS_TABLE = import.meta.env.VITE_SUPABASE_PRODUCTS_TABLE || 'products'

function toSortableNumber(value) {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

function normalizeProduct(row, index, isKorean) {
  const typeTag = row.product_type?.trim() || ''
  const meatTag = row.meat_type?.trim() || ''

  return {
    id: row.product_id ?? `product-${index}`,
    title: isKorean ? row.korean_name ?? `Product ${index + 1}` : row.english_name ?? `Product ${index + 1}`,
    description: typeTag,
    price: meatTag,
    tags: [typeTag, meatTag].filter(Boolean),
    imageUrl: '',
    sortOrder: toSortableNumber(row.product_id),
    createdAt: null,
  }
}

function sortProducts(products) {
  return [...products].sort((left, right) => {
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

export default function useSupabaseProducts() {
  const { i18n } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorKey, setErrorKey] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const isKorean = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('ko')

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      setErrorKey('products.notConfigured')
      setErrorMessage('')
      return undefined
    }

    let active = true

    const loadProducts = async () => {
      setLoading(true)
      setErrorKey(null)
      setErrorMessage('')

      const { data, error } = await supabase.from(PRODUCTS_TABLE).select('*')

      if (!active) {
        return
      }

      if (error) {
        setProducts([])
        setErrorKey('products.error')
        setErrorMessage(`${error.message} (table: ${PRODUCTS_TABLE})`)
        setLoading(false)
        return
      }

      const normalizedProducts = sortProducts((data ?? []).map((row, index) => normalizeProduct(row, index, isKorean)))
      setProducts(normalizedProducts)
      setLoading(false)
    }

    loadProducts()

    const channel = supabase
      .channel(`products:${PRODUCTS_TABLE}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: PRODUCTS_TABLE },
        () => {
          loadProducts()
        },
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [isKorean])

  return { products, loading, errorKey, errorMessage, tableName: PRODUCTS_TABLE }
}