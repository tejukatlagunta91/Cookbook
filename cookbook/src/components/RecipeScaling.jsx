import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const RecipeScaling = ({ originalServings, ingredients, onScaleChange }) => {
  const [scaleFactor, setScaleFactor] = useState(1);
  const [currentServings, setCurrentServings] = useState(originalServings);

  const handleScale = (newServings) => {
    const factor = newServings / originalServings;
    setScaleFactor(factor);
    setCurrentServings(newServings);
    if (onScaleChange) {
      onScaleChange(factor);
    }
  };

  const scaleIngredient = (ingredient) => {
    // Extract numbers and units from ingredient string
    const match = ingredient.match(/([\d.]+)\s*([a-zA-Z]+)?\s*(.*)/);
    if (match) {
      const [, amount, unit, rest] = match;
      const scaledAmount = (parseFloat(amount) * scaleFactor).toFixed(2);
      return `${scaledAmount} ${unit || ''} ${rest}`.trim();
    }
    return ingredient;
  };

  const scaledIngredients = ingredients.map(scaleIngredient);

  return (
    <div className="soft-card rounded-3xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Scale recipe</p>
          <p className="text-2xl font-semibold text-white">Servings control</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleScale(Math.max(1, currentServings - 1))}
            className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20"
          >
            <FaMinus />
          </button>
          <span className="text-lg font-semibold min-w-[80px] text-center text-white">{currentServings} servings</span>
          <button
            onClick={() => handleScale(currentServings + 1)}
            className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      {scaleFactor !== 1 && (
        <p className="text-sm text-slate-400 mb-4">Scaled by {scaleFactor.toFixed(2)}x</p>
      )}
      <div className="bg-white/5 rounded-2xl p-4">
        <h4 className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-3">Scaled ingredients</h4>
        <ul className="space-y-2 text-slate-200 text-sm">
          {scaledIngredients.map((ingredient, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="w-2 h-2 mt-2 rounded-full bg-amber-200" />
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeScaling;

