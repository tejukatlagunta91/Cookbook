import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeService } from '../services/api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cuisine: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Easy',
    ingredients: [''],
    instructions: [''],
    image: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    try {
      setInitialLoading(true);
      const data = await recipeService.getById(id);
      setFormData({
        ...data,
        ingredients: data.ingredients.length > 0 ? data.ingredients : [''],
        instructions: data.instructions.length > 0 ? data.instructions : [''],
      });
      setTagInput(data.tags ? data.tags.join(', ') : '');
    } catch (error) {
      toast.error('Failed to load recipe');
      navigate('/');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ingredients: newIngredients.length > 0 ? newIngredients : [''],
    });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  };

  const removeInstruction = (index) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      instructions: newInstructions.length > 0 ? newInstructions : [''],
    });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    const tags = e.target.value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData({ ...formData, tags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recipeData = {
        ...formData,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        ingredients: formData.ingredients.filter((ing) => ing.trim() !== ''),
        instructions: formData.instructions.filter((inst) => inst.trim() !== ''),
      };

      if (isEditMode) {
        await recipeService.update(id, recipeData);
        toast.success('Recipe updated successfully');
      } else {
        await recipeService.create(recipeData);
        toast.success('Recipe created successfully');
      }

      navigate('/');
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} recipe`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-4xl text-orange-600 dark:text-orange-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-50 dark:bg-gray-900 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                placeholder="Enter recipe title"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Cuisine *
              </label>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                placeholder="e.g., Italian, Indian, American"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Describe your recipe"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Prep Time (minutes) *
              </label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Cook Time (minutes) *
              </label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Servings *
              </label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Difficulty *
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="e.g., dessert, vegetarian, quick"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Ingredients *
            </label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  placeholder="Enter ingredient"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add Ingredient</span>
            </button>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Instructions *
            </label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2 mb-2">
                <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mt-2 flex-shrink-0">
                  {index + 1}
                </span>
                <textarea
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  rows="2"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  placeholder="Enter instruction step"
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition mt-2"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add Instruction</span>
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-600 dark:bg-orange-500 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Recipe' : 'Create Recipe'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;

