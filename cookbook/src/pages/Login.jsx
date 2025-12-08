import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      })
      toast.success('Welcome back! Redirecting to your kitchen...')
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black via-slate-900 to-[#120b05]">
      <div className="grid lg:grid-cols-2 w-full max-w-5xl gap-8 items-center">
        <div className="hidden lg:block space-y-6">
          <div className="brand-gradient rounded-3xl p-8 shadow-2xl text-slate-900">
            <p className="text-sm uppercase tracking-[0.5em] text-black/70">CookBook</p>
            <h1 className="text-4xl font-bold mt-3 leading-tight">
              Curate your <span className="underline decoration-black/30">culinary identity</span>
            </h1>
            <p className="text-black/80 mt-4">
              Seamlessly manage recipes, plan menus, and craft unforgettable dining experiences.
            </p>
          </div>
          <div className="soft-card rounded-3xl p-6 space-y-2 border border-white/10">
            <p className="text-sm text-slate-300 uppercase tracking-[0.4em]">Pro Tip</p>
            <p className="text-xl text-white">
              Use any valid email & password to unlock your virtual kitchen assistant.
            </p>
          </div>
        </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/10">
        <div className="text-center space-y-2 mb-8">
          <p className="pill bg-white/10 text-xs tracking-[0.4em] text-amber-200">Sign In</p>
          <h2 className="text-3xl font-semibold text-white">Welcome back, Chef</h2>
          <p className="text-slate-400">Log in to access your personalized dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-[0.4em] text-slate-400">Email Address</label>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-white/40">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
                placeholder="chef@cookbook.dev"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm uppercase tracking-[0.4em] text-slate-400">Password</label>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-white/40">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="rounded border-white/20 bg-transparent text-amber-200 focus:ring-amber-200"
              />
              <span>Remember me</span>
            </label>
            <span className="text-amber-200 cursor-pointer hover:underline">Forgot password?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full brand-gradient rounded-2xl py-3 font-semibold tracking-widest uppercase shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition"
          >
            {loading ? 'Signing in...' : 'Enter Kitchen'}
          </button>
        </form>
      </div>
      </div>
    </div>
  )
}

export default Login

