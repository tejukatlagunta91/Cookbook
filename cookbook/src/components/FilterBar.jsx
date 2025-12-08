import { FaFilter } from 'react-icons/fa'

const FilterBar = ({
  cuisines,
  selectedCuisine,
  onFilterChange,
  difficulties,
  selectedDifficulty,
  onDifficultyChange,
}) => {
  const renderChips = (items, selected, onSelect) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('')}
        className={`px-4 py-2 rounded-full border transition text-sm font-semibold ${
          selected === ''
            ? 'brand-gradient shadow-lg'
            : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
        }`}
      >
        All
      </button>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`px-4 py-2 rounded-full border transition text-sm font-semibold capitalize ${
            selected === item
              ? 'brand-gradient shadow-lg'
              : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )

  return (
    <div className="soft-card rounded-3xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <span className="pill flex items-center space-x-2 bg-white/20 text-slate-900 uppercase tracking-[0.3em]">
          <FaFilter />
          <span>Filters</span>
        </span>
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Cuisine</p>
        {renderChips(cuisines, selectedCuisine, onFilterChange)}
      </div>

      {difficulties && difficulties.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Difficulty</p>
          {renderChips(difficulties, selectedDifficulty, onDifficultyChange)}
        </div>
      )}
    </div>
  )
}

export default FilterBar
