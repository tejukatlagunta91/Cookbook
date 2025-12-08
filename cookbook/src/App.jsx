import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import RecipeForm from './pages/RecipeForm'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'

const AppShell = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#05070d] via-[#0b0f17] to-black text-slate-50">
        {isAuthenticated && <Navbar />}
        <main className="page-shell">
          <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/new"
            element={
              <ProtectedRoute>
                <RecipeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute>
                <RecipeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:id/edit"
            element={
              <ProtectedRoute>
                <RecipeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
