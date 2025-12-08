import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, placeholder = 'Search recipes...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <div className="absolute inset-0 bg-white/10 rounded-2xl blur-2xl group-hover:bg-white/20 transition"></div>
        <div className="relative flex items-center bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-2xl">
          <FaSearch className="text-amber-200 mr-3 text-xl" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full bg-transparent text-slate-50 placeholder-slate-400 focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="ml-3 px-4 py-2 rounded-xl bg-white/90 text-slate-900 font-semibold text-sm uppercase tracking-widest hover:-translate-y-0.5 transition"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  )
};

export default SearchBar;
