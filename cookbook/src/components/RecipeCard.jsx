import { Link } from 'react-router-dom'
import { FaClock, FaUsers, FaUtensils, FaHeart, FaStar } from 'react-icons/fa'
import { useState } from 'react'
import { recipeService } from '../services/api'
import { toast } from 'react-toastify'

const RecipeCard = ({ recipe, onFavoriteToggle, onCardClick, hideFavoriteButton = false }) => {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false)

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const updatedRecipe = { ...recipe, isFavorite: !isFavorite }
      await recipeService.update(recipe.id, updatedRecipe)
      setIsFavorite(!isFavorite)
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
      if (onFavoriteToggle) {
        onFavoriteToggle(recipe.id, !isFavorite)
      }
    } catch (error) {
      toast.error('Failed to update favorite status')
    }
  }

  const cardBody = (
    <article className="soft-card rounded-3xl overflow-hidden h-full flex flex-col border border-white/5 hover:-translate-y-1 transition">
        <div className="relative h-56 overflow-hidden">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'}
            alt={recipe.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="brand-gradient px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {recipe.cuisine}
            </span>
            {recipe.difficulty && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/10 uppercase tracking-wider">
                {recipe.difficulty}
              </span>
            )}
          </div>
          {!hideFavoriteButton && (
            <button
              onClick={handleFavoriteToggle}
              className={`absolute top-4 right-4 w-11 h-11 rounded-full backdrop-blur-xl flex items-center justify-center ${
                isFavorite ? 'bg-white text-rose-600' : 'bg-black/40 text-white'
              }`}
            >
              <FaHeart />
            </button>
          )}
          {recipe.rating > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm">
              <FaStar className="text-amber-300" />
              <span>{recipe.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-white leading-tight mb-2 line-clamp-2">
              {recipe.title}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2">{recipe.description}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300">
            <div className="flex items-center space-x-1">
              <FaClock className="text-amber-200" />
              <span>{recipe.prepTime + recipe.cookTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaUsers className="text-amber-200" />
              <span>{recipe.servings} ppl</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaUtensils className="text-amber-200" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-3 py-1 rounded-full text-xs bg-white/10 text-slate-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
  )

  if (onCardClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          onCardClick(recipe)
        }}
        className="block group h-full text-left"
      >
        {cardBody}
      </button>
    )
  }

  return (
    <Link to={`/recipes/${recipe.id}`} className="block group h-full">
      {cardBody}
    </Link>
  )
}

export default RecipeCard
