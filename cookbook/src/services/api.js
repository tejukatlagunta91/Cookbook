import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Recipe CRUD operations
export const recipeService = {
  // Get all recipes
  getAll: async () => {
    const response = await api.get('/recipes');
    return response.data;
  },

  // Get recipe by ID
  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Create new recipe
  create: async (recipe) => {
    const response = await api.post('/recipes', recipe);
    return response.data;
  },

  // Update recipe
  update: async (id, recipe) => {
    const response = await api.put(`/recipes/${id}`, recipe);
    return response.data;
  },

  // Delete recipe
  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  // Search recipes by title, cuisine, or ingredients
  search: async (query) => {
    const response = await api.get('/recipes', {
      params: {
        q: query,
      },
    });
    return response.data;
  },

  // Filter by cuisine
  filterByCuisine: async (cuisine) => {
    const response = await api.get('/recipes', {
      params: {
        cuisine: cuisine,
      },
    });
    return response.data;
  },
};

export default api;

