import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { Brain, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            login()
        }, 1000)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] opacity-20 pointer-events-none" />

            <div className="w-full max-w-md p-8 bg-card/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl relative z-10">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tighter">Brain-view</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">Thinking-first second brain.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                        <Input
                            type="email"
                            placeholder="brain@thoughtsy.ai"
                            className="bg-background/50 border-white/10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                            <Link to="#" className="text-sm text-primary hover:text-primary/80">Forgot password?</Link>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-background/50 border-white/10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button className="w-full h-11 text-base" disabled={isLoading}>
                        {isLoading ? 'Accessing Brain...' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have a brain yet?{' '}
                    <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                        Sign up
                    </Link>
                </div>

                <div className="mt-8 text-center text-xs text-muted-foreground/50">
                    By continuing, you agree to our Terms of Service <br /> and Privacy Policy.
                </div>
            </div>
        </div>
    )
}
