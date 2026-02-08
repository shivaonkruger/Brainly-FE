import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import ContentPage from './pages/Dashboard/ContentPage'
import RoadmapPage from './pages/Roadmap/RoadmapPage'
import TodoPage from './pages/Todo/TodoPage'
import { AuthProvider } from './context/AuthContext'

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuth()
//   return isAuthenticated ? children : <Navigate to="/" />
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/content" element={
            <ContentPage />
          } />
          <Route path="/roadmap" element={
            // <ProtectedRoute>
            <RoadmapPage />
            // </ProtectedRoute>
          } />
          <Route path="/todo" element={
            // <ProtectedRoute>
            <TodoPage />
            // </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
