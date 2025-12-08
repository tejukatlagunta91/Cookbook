import { FaSort, FaClock, FaSignInAlt } from 'react-icons/fa'

const SortBar = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'time-asc', label: 'Time • Short to Long', icon: FaClock },
    { value: 'time-desc', label: 'Time • Long to Short', icon: FaClock },
    { value: 'difficulty', label: 'Chef Difficulty', icon: FaSignInAlt },
  ]

  return (
    <div className="soft-card rounded-3xl p-5 flex flex-wrap items-center gap-3">
      <div className="flex items-center space-x-2">
        <span className="pill bg-white/10 text-xs tracking-[0.4em] text-slate-200">
          <FaSort className="inline mr-2" />
          Sort
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const Icon = option.icon
          const isActive = sortBy === option.value
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 transition ${
                isActive ? 'brand-gradient shadow-lg' : 'bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              <Icon />
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SortBar
