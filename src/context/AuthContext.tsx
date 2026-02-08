import { useState, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Mock authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    const login = () => {
        setIsAuthenticated(true)
        navigate('/content')
    }

    const logout = () => {
        setIsAuthenticated(false)
        navigate('/')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
