import { useState, useEffect } from 'react';
import { recipeService } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SortBar from '../components/SortBar';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { fetchFeaturedRecipes, searchTastyRecipes } from '../services/tastyApi';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('time-asc');
  const [cuisines, setCuisines] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState('');
  const [externalResults, setExternalResults] = useState([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState('');
  const [selectedExternal, setSelectedExternal] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setFeaturedLoading(true);
        setFeaturedError('');
        const results = await fetchFeaturedRecipes();
        setFeatured(results);
      } catch (error) {
        setFeaturedError('Unable to reach Tasty API right now.');
      } finally {
        setFeaturedLoading(false);
      }
    };
    loadFeatured();
  }, []);

  useEffect(() => {
    filterAndSortRecipes();
  }, [recipes, searchTerm, selectedCuisine, selectedDifficulty, sortBy]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getAll();
      setRecipes(data);
      setFilteredRecipes(data);
      
      // Extract unique cuisines
      const uniqueCuisines = [...new Set(data.map(recipe => recipe.cuisine))];
      setCuisines(uniqueCuisines);
      
      // Extract unique difficulties
      const uniqueDifficulties = [...new Set(data.map(recipe => recipe.difficulty))];
      setDifficulties(uniqueDifficulties.sort());
    } catch (error) {
      toast.error('Failed to load recipes');
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedRecipes = (
    allRecipes,
    term,
    cuisine,
    difficulty,
    sortKey,
  ) => {
    let filtered = [...allRecipes];

    // Filter by cuisine
    if (cuisine) {
      filtered = filtered.filter((recipe) => recipe.cuisine === cuisine);
    }

    // Filter by difficulty
    if (difficulty) {
      filtered = filtered.filter((recipe) => recipe.difficulty === difficulty);
    }

    // Filter by search term
    if (term) {
      const lowered = term.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(lowered) ||
          recipe.description.toLowerCase().includes(lowered) ||
          recipe.cuisine.toLowerCase().includes(lowered) ||
          (recipe.ingredients &&
            recipe.ingredients.some((ing) => ing.toLowerCase().includes(lowered))) ||
          (recipe.tags && recipe.tags.some((tag) => tag.toLowerCase().includes(lowered))),
      );
    }

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortKey) {
        case 'time-asc':
          return a.prepTime + a.cookTime - (b.prepTime + b.cookTime);
        case 'time-desc':
          return b.prepTime + b.cookTime - (a.prepTime + a.cookTime);
        case 'difficulty': {
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
        }
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filterAndSortRecipes = () => {
    const filtered = getFilteredAndSortedRecipes(
      recipes,
      searchTerm,
      selectedCuisine,
      selectedDifficulty,
      sortBy,
    );
    setFilteredRecipes(filtered);

    // If we have local matches, clear any external results
    if (filtered.length > 0) {
      setExternalResults([]);
      setExternalError('');
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    const trimmed = term ? term.trim() : '';

    // If search is empty or too short, just reset external state
    if (!trimmed || trimmed.length < 3) {
      setExternalResults([]);
      setExternalError('');
      return;
    }

    // First, try to satisfy the search from the local database
    const localMatches = getFilteredAndSortedRecipes(
      recipes,
      trimmed,
      selectedCuisine,
      selectedDifficulty,
      sortBy,
    );
    setFilteredRecipes(localMatches);

    if (localMatches.length > 0) {
      // We found recipes in the local DB, no need to hit the external API
      setExternalResults([]);
      setExternalError('');
      return;
    }

    // No local matches – fall back to the Tasty API
    setExternalLoading(true);
    setExternalError('');
    try {
      const apiData = await searchTastyRecipes(trimmed);
      setExternalResults(apiData);
    } catch (error) {
      setExternalError(error.message || 'Unable to fetch search results.');
    } finally {
      setExternalLoading(false);
    }
  };

  const handleFilterChange = (cuisine) => {
    setSelectedCuisine(cuisine);
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleFavoriteToggle = (recipeId, isFavorite) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId ? { ...recipe, isFavorite } : recipe
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-4xl text-orange-600 dark:text-orange-400" />
      </div>
    );
  }

  const totalRecipes = recipes.length
  const favoriteCount = recipes.filter((recipe) => recipe.isFavorite).length
  const avgTime =
    recipes.length > 0
      ? Math.round(
          recipes.reduce((acc, recipe) => acc + recipe.prepTime + recipe.cookTime, 0) / recipes.length,
        )
      : 0

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="glass-panel rounded-3xl p-8 space-y-6">
          <div className="space-y-3">
            <p className="pill bg-white/15 text-xs tracking-[0.4em]">Cook Smarter</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              Curate your personal <span className="text-amber-200">culinary universe</span>
            </h1>
            <p className="text-slate-300">
              Search thousands of curated recipes, organize your kitchen rituals, and craft signature dishes with ease.
            </p>
          </div>
          <SearchBar onSearch={handleSearch} />
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Recipes', value: totalRecipes },
              { label: 'Favorites', value: favoriteCount },
              { label: 'Avg. Time', value: `${avgTime || 0}m` },
            ].map((stat) => (
              <div key={stat.label} className="soft-card rounded-2xl px-4 py-3 text-center border border-white/5">
                <p className="text-sm uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-card rounded-3xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-white">Today&apos;s spotlight</h2>
          <p className="text-slate-400 text-sm">
            Filter by cuisine, difficulty, and total time to sculpt the perfect menu for every occasion.
          </p>
          {cuisines.length > 0 && (
            <FilterBar
              cuisines={cuisines}
              selectedCuisine={selectedCuisine}
              onFilterChange={handleFilterChange}
              difficulties={difficulties}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={handleDifficultyChange}
            />
          )}
        </div>
      </section>

      <section className="soft-card rounded-3xl p-6 space-y-6 border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="pill bg-white/10 text-xs tracking-[0.4em] text-amber-100">Fresh Inspiration</p>
            <h2 className="text-3xl font-semibold text-white mt-2">Featured from Tasty</h2>
            <p className="text-slate-400 text-sm max-w-2xl">
              Pulled live from the Tasty catalog (limited to 4 per request to respect the free API tier).
            </p>
          </div>
        </div>
        {featuredError && <p className="text-rose-300 text-sm">{featuredError}</p>}
        {featuredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((skeleton) => (
              <div key={skeleton} className="soft-card rounded-3xl h-56 animate-pulse bg-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {featured.map((item) => (
              <article key={item.id} className="soft-card rounded-3xl overflow-hidden border border-white/10">
                <div className="h-36 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{item.cuisine}</p>
                  <h3 className="text-lg font-semibold text-white line-clamp-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{item.prepTime + item.cookTime}m total</span>
                    <span>{item.servings} servings</span>
                  </div>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full mt-2 px-3 py-2 rounded-2xl bg-white/10 text-sm font-semibold hover:bg-white/20 transition"
                    >
                      View on Tasty
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {externalResults.length > 0 && (
        <section className="soft-card rounded-3xl p-6 space-y-6 border border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="pill bg-white/10 text-xs tracking-[0.4em] text-amber-100">Search Results</p>
              <h2 className="text-3xl font-semibold text-white mt-2">Powered by Tasty</h2>
              <p className="text-slate-400 text-sm max-w-2xl">
                Showing up to four matches for &quot;{searchTerm}&quot;. Tap a card to preview its description.
              </p>
            </div>
          </div>
          {externalError && <p className="text-rose-300 text-sm">{externalError}</p>}
          {externalLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((skeleton) => (
                <div key={skeleton} className="soft-card rounded-3xl h-56 animate-pulse bg-white/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {externalResults.map((item) => (
                <RecipeCard
                  key={item.id}
                  recipe={item}
                  hideFavoriteButton
                  onCardClick={() => setSelectedExternal(item)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {filteredRecipes.length > 0 && (
        <SortBar sortBy={sortBy} onSortChange={handleSortChange} />
      )}

      {filteredRecipes.length === 0 ? (
        <div className="soft-card rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🍳</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {searchTerm || selectedCuisine || selectedDifficulty ? 'No recipes found' : 'No recipes yet'}
          </h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || selectedCuisine || selectedDifficulty
              ? 'Try adjusting your search or filters'
              : 'Start building your signature collection by adding your first recipe!'}
          </p>
          {!searchTerm && !selectedCuisine && !selectedDifficulty && (
            <button
              onClick={() => window.location.assign('/recipes/new')}
              className="brand-gradient px-6 py-3 rounded-full font-semibold tracking-wider uppercase shadow-lg"
            >
              Add Your First Recipe
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onFavoriteToggle={handleFavoriteToggle} />
          ))}
        </div>
      )}

      {/* external modal */}
      {selectedExternal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="soft-card rounded-3xl max-w-2xl w-full p-8 border border-white/10 relative">
            <button
              onClick={() => setSelectedExternal(null)}
              className="absolute top-4 right-4 text-slate-300 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-3xl font-semibold text-white mb-4">{selectedExternal.title}</h3>
            <p className="text-slate-200 mb-6">{selectedExternal.description}</p>
            {selectedExternal.sourceUrl && (
              <a
                href={selectedExternal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-full brand-gradient font-semibold tracking-wide"
              >
                View full recipe on Tasty
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
};

export default Home;

