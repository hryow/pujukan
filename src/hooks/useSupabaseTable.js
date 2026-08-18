import { useEffect, useState } from 'react'
import { supabase } from '../supabase.js'

export function useSupabaseTable(tableName, normalizeRow, sortRows, deps = []) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(() => Boolean(supabase))
  const [errorKey, setErrorKey] = useState(() => (supabase ? null : `${tableName}.notConfigured`))
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let active = true

    const load = async () => {
      setLoading(true)
      setErrorKey(null)
      setErrorMessage('')

      const { data, error } = await supabase.from(tableName).select('*')

      if (!active) {
        return
      }

      if (error) {
        setItems([])
        setErrorKey(`${tableName}.error`)
        setErrorMessage(`${error.message} (table: ${tableName})`)
        setLoading(false)
        return
      }

      setItems(sortRows((data ?? []).map((row, index) => normalizeRow(row, index))))
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel(`${tableName}:changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, load)
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName, ...deps])

  return { items, loading, errorKey, errorMessage, tableName }
}