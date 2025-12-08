import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeService } from '../services/api';
import { toast } from 'react-toastify';
import { FaClock, FaUsers, FaUtensils, FaHeart, FaEdit, FaTrash, FaArrowLeft, FaCopy, FaPrint, FaShare, FaSpinner, FaFilePdf } from 'react-icons/fa';
import Rating from '../components/Rating';
import CookingTimer from '../components/CookingTimer';
import RecipeScaling from '../components/RecipeScaling';
import { exportRecipeToPDF } from '../utils/pdfExport';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getById(id);
      setRecipe(data);
      setIsFavorite(data.isFavorite || false);
    } catch (error) {
      toast.error('Failed to load recipe');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeService.delete(id);
        toast.success('Recipe deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const updatedRecipe = { ...recipe, isFavorite: !isFavorite };
      await recipeService.update(id, updatedRecipe);
      setIsFavorite(!isFavorite);
      setRecipe(updatedRecipe);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  const handleDuplicate = async () => {
    try {
      const { id, ...recipeWithoutId } = recipe;
      const newRecipe = {
        ...recipeWithoutId,
        title: `${recipe.title} (Copy)`,
        isFavorite: false,
      };
      const created = await recipeService.create(newRecipe);
      toast.success('Recipe duplicated successfully!');
      navigate(`/recipes/${created.id}`);
    } catch (error) {
      toast.error('Failed to duplicate recipe');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePDFExport = () => {
    try {
      exportRecipeToPDF(recipe);
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Recipe link copied to clipboard!');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Recipe link copied to clipboard!');
    }
  };

  const handleRatingChange = (recipeId, rating) => {
    setRecipe({ ...recipe, rating });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-4xl text-orange-600 dark:text-orange-400" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center bg-gray-50 dark:bg-gray-900 min-h-screen">
        <p className="text-gray-600 dark:text-gray-400 text-xl">Recipe not found</p>
        <Link to="/" className="text-orange-600 dark:text-orange-400 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Recipes
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96">
              <img
                src={recipe.image || 'https://via.placeholder.com/800x400?text=Recipe'}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-3 rounded-full ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  } hover:bg-red-600 transition shadow-lg`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <FaHeart />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 transition shadow-lg"
                  title="Share recipe"
                >
                  <FaShare />
                </button>
                <button
                  onClick={handlePDFExport}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-700 transition shadow-lg"
                  title="Export to PDF"
                >
                  <FaFilePdf />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-lg"
                  title="Print recipe"
                >
                  <FaPrint />
                </button>
                <Link
                  to={`/recipes/${id}/edit`}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-lg"
                  title="Edit recipe"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-700 transition shadow-lg"
                  title="Delete recipe"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">{recipe.title}</h1>
                <span className="bg-orange-600 dark:bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">
                  {recipe.cuisine}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">{recipe.description}</p>

              <div className="mb-6">
                <Rating recipe={recipe} onRatingChange={handleRatingChange} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <FaClock className="text-orange-600 dark:text-orange-400 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prep Time</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{recipe.prepTime} min</p>
                </div>
                <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <FaClock className="text-orange-600 dark:text-orange-400 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cook Time</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{recipe.cookTime} min</p>
                </div>
                <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <FaUsers className="text-orange-600 dark:text-orange-400 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Servings</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{recipe.servings}</p>
                </div>
                <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <FaUtensils className="text-orange-600 dark:text-orange-400 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{recipe.difficulty}</p>
                </div>
              </div>

              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <RecipeScaling
                originalServings={recipe.servings}
                ingredients={recipe.ingredients}
              />

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-600 dark:text-orange-400 mr-2">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Instructions</h2>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-orange-600 dark:bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CookingTimer initialMinutes={recipe.prepTime + recipe.cookTime} label="Cooking Timer" />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
