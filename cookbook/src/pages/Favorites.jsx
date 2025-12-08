import { useState, useEffect } from 'react'
import { recipeService } from '../services/api'
import RecipeCard from '../components/RecipeCard'
import { toast } from 'react-toastify'
import { FaHeart, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const allRecipes = await recipeService.getAll()
      const favoriteRecipes = allRecipes.filter((recipe) => recipe.isFavorite)
      setFavorites(favoriteRecipes)
    } catch (error) {
      toast.error('Failed to load favorites')
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = (recipeId, isFavorite) => {
    if (!isFavorite) {
      setFavorites((prevFavorites) => prevFavorites.filter((recipe) => recipe.id !== recipeId))
    } else {
      loadFavorites()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FaSpinner className="animate-spin text-4xl text-amber-200" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header className="soft-card rounded-3xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
          <p className="pill bg-white/10 text-xs tracking-[0.4em] text-amber-100">Favorites</p>
          <h1 className="text-4xl font-bold text-white">Curated Chef&apos;s Vault</h1>
          <p className="text-slate-300">
            {favorites.length === 0
              ? "You haven't favorited any recipes yet. Start exploring and save your culinary gems."
              : `You have ${favorites.length} favorite recipe${favorites.length !== 1 ? 's' : ''}. Your palate has great taste.`}
          </p>
        </div>
        <div className="brand-gradient rounded-3xl px-6 py-5 shadow-2xl text-center">
          <FaHeart className="text-4xl mx-auto mb-2" />
          <p className="text-5xl font-bold">{favorites.length}</p>
          <p className="text-sm uppercase tracking-[0.4em]">Saved</p>
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="soft-card rounded-3xl p-12 text-center space-y-4">
          <p className="text-2xl">✨</p>
          <h3 className="text-2xl font-semibold text-white">Your favorites list is empty</h3>
          <p className="text-slate-400">Discover recipes tailored to your taste and save them for instant access.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold tracking-wide bg-white/90 text-slate-900 hover:-translate-y-0.5 transition"
          >
            Explore Recipes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onFavoriteToggle={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites
