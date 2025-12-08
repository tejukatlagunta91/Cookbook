import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { recipeService } from '../services/api';
import { toast } from 'react-toastify';

const Rating = ({ recipe, onRatingChange }) => {
  const [rating, setRating] = useState(recipe.rating || 0);
  const [hover, setHover] = useState(0);

  const handleRating = async (newRating) => {
    try {
      const updatedRecipe = { ...recipe, rating: newRating };
      await recipeService.update(recipe.id, updatedRecipe);
      setRating(newRating);
      if (onRatingChange) {
        onRatingChange(recipe.id, newRating);
      }
      toast.success('Rating saved!');
    } catch (error) {
      toast.error('Failed to save rating');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating:</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <FaStar
              className={`text-2xl transition-colors ${
                star <= (hover || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({rating}/5)
        </span>
      )}
    </div>
  );
};

export default Rating;

