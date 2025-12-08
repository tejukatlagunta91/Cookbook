import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBook, FaHeart, FaPlus, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import DarkModeToggle from './DarkModeToggle'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Discover', path: '/' },
  { label: 'Favorites', path: '/favorites' },
]

const Navbar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="px-4 pt-6 mb-6">
      <nav className="brand-gradient text-slate-900 rounded-3xl shadow-2xl shadow-orange-900/20 px-6 py-3 flex items-center justify-between border border-white/30">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 font-semibold tracking-wide">
            <div className="w-11 h-11 rounded-2xl bg-white/80 text-slate-900 flex items-center justify-center shadow-inner">
              <FaBook className="text-2xl" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-700">CookBook</p>
              <p className="text-lg font-bold">Virtual Kitchen</p>
            </div>
          </Link>
          <span className="hidden lg:inline-block h-10 w-px bg-black/25" />
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  pathname === link.path ? 'bg-black/15 shadow-lg' : 'hover:bg-black/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/recipes/new')}
            className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-white/90 text-slate-900 font-semibold shadow-lg hover:-translate-y-0.5 transition"
          >
            <FaPlus />
            <span>New Recipe</span>
          </button>

          <button
            onClick={() => navigate('/favorites')}
            className={`flex md:hidden items-center justify-center w-10 h-10 rounded-full ${pathname === '/favorites' ? 'bg-black/20' : 'bg-black/10'}`}
          >
            <FaHeart />
          </button>

          <button className="w-11 h-11 rounded-full bg-black/10 flex items-center justify-center shadow-lg">
            <FaUserCircle className="text-2xl" title={user?.email} />
          </button>

          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-black/15 text-sm font-semibold hover:bg-black/25 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

          <DarkModeToggle />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
