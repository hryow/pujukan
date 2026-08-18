import { useEffect, useMemo, useState } from 'react'

const GRAPH_API_BASE_URL = import.meta.env.VITE_INSTAGRAM_GRAPH_API_BASE_URL || 'https://graph.facebook.com'
const GRAPH_API_VERSION = import.meta.env.VITE_INSTAGRAM_GRAPH_API_VERSION || 'v25.0'
const IG_USER_ID = import.meta.env.VITE_INSTAGRAM_IG_USER_ID || ''
const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || ''
const PROFILE_URL = import.meta.env.VITE_INSTAGRAM_PROFILE_URL || 'https://www.instagram.com/pujukan_ch/'
const DEFAULT_LIMIT = 8

function stripHtml(value) {
  return typeof value === 'string' ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : ''
}

function getFirstChildMediaUrl(children) {
  if (!Array.isArray(children)) {
    return ''
  }

  for (const child of children) {
    const mediaUrl = typeof child.media_url === 'string' ? child.media_url.trim() : ''
    if (mediaUrl) {
      return mediaUrl
    }

    const thumbnailUrl = typeof child.thumbnail_url === 'string' ? child.thumbnail_url.trim() : ''
    if (thumbnailUrl) {
      return thumbnailUrl
    }
  }

  return ''
}

function getMediaUrl(item) {
  if (item.media_type === 'VIDEO') {
    return typeof item.thumbnail_url === 'string' && item.thumbnail_url.trim()
      ? item.thumbnail_url.trim()
      : typeof item.media_url === 'string'
        ? item.media_url.trim()
        : ''
  }

  if (item.media_type === 'CAROUSEL_ALBUM') {
    return getFirstChildMediaUrl(item.children?.data) || (typeof item.media_url === 'string' ? item.media_url.trim() : '')
  }

  return (
    (typeof item.media_url === 'string' ? item.media_url.trim() : '') ||
    (typeof item.thumbnail_url === 'string' ? item.thumbnail_url.trim() : '')
  )
}

export default function useInstagramPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const feedUrl = useMemo(() => {
    if (!IG_USER_ID || !ACCESS_TOKEN) {
      return ''
    }

    const url = new URL(`${GRAPH_API_BASE_URL.replace(/\/$/, '')}/${GRAPH_API_VERSION}/${IG_USER_ID}/media`)
    url.search = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_type,media_url,thumbnail_url}',
      limit: String(DEFAULT_LIMIT),
      access_token: ACCESS_TOKEN,
    }).toString()
    return url.toString()
  }, [])

  useEffect(() => {
    let active = true

    const loadPosts = async () => {
      setLoading(true)
      setErrorMessage('')

      if (!feedUrl) {
        if (active) {
          setPosts([])
          setErrorMessage('Instagram Graph API is not configured. Set VITE_INSTAGRAM_IG_USER_ID and VITE_INSTAGRAM_ACCESS_TOKEN.')
          setLoading(false)
        }
        return
      }

      try {
        const response = await fetch(feedUrl)
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error?.message || `Instagram Graph API request failed with ${response.status}`)
        }

        const payload = await response.json()
        const items = Array.isArray(payload?.data) ? payload.data : []
        const normalizedPosts = items
          .map((item, index) => ({
            id: item.id ?? item.permalink ?? `instagram-${index}`,
            title: stripHtml(item.caption) || `Instagram post ${index + 1}`,
            description: stripHtml(item.caption),
            permalink: item.permalink ?? PROFILE_URL,
            publishedAt: item.timestamp ?? '',
            imageUrl: getMediaUrl(item),
          }))
          .filter((item) => item.imageUrl)

        if (active) {
          setPosts(normalizedPosts)
        }
      } catch (error) {
        if (active) {
          setPosts([])
          setErrorMessage(error instanceof Error ? error.message : 'Instagram feed could not be loaded.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      active = false
    }
  }, [feedUrl])

  return { posts, loading, errorMessage, profileUrl: PROFILE_URL }
}