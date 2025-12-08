const API_BASE_URL = 'https://tasty.p.rapidapi.com/recipes/list'
const FALLBACK_TASTY_KEY = 'b6b8b86214msh01429f29b02948cp17f038jsnf0f0990eb23e'
const DEFAULT_PARAMS = {
  from: 0,
  size: 4, // keep requests tiny for free tier
  tags: 'under_30_minutes',
}

const mapToRecipe = (item) => ({
  id: `tasty-${item.id}`,
  title: item.name,
  description:
    item.description ||
    'Quick inspiration curated from Tasty. Tap to learn more about ingredients and prep.',
  image: item.thumbnail_url,
  cuisine: item.country || 'Global',
  prepTime: item.prep_time_minutes || item.total_time_minutes || 10,
  cookTime: item.cook_time_minutes || 10,
  servings: item.num_servings || 2,
  difficulty: (item.difficulty || 'Medium').replace('_', ' '),
  rating: item.user_ratings?.score
    ? Number((item.user_ratings.score * 5).toFixed(1))
    : 0,
  tags: item.tags?.slice(0, 3).map((tag) => tag.display_name) || [],
  sourceUrl: item.original_video_url || item.canonical_id,
})

const resolveApiKey = () => {
  const envKey = import.meta.env.VITE_TASTY_API_KEY
  if (envKey && envKey !== 'YOUR_RAPIDAPI_KEY_HERE') return envKey
  return FALLBACK_TASTY_KEY
}

export const fetchFeaturedRecipes = async () => {
  const apiKey = resolveApiKey()

  const params = new URLSearchParams(DEFAULT_PARAMS).toString()
  const resp = await fetch(`${API_BASE_URL}?${params}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
    },
  })

  if (!resp.ok) {
    throw new Error('Unable to fetch featured recipes')
  }

  const data = await resp.json()
  return (data.results || []).slice(0, 4).map(mapToRecipe)
}

export const searchTastyRecipes = async (query) => {
  if (!query) return []
  const apiKey = resolveApiKey()

  const params = new URLSearchParams({
    from: 0,
    size: 4,
    q: query,
  }).toString()

  const resp = await fetch(`${API_BASE_URL}?${params}`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
    },
  })

  if (!resp.ok) {
    throw new Error('Unable to search Tasty right now.')
  }

  const data = await resp.json()
  return (data.results || []).map(mapToRecipe)
}

