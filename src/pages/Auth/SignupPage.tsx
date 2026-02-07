import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { Brain, ArrowRight } from 'lucide-react'

export default function SignupPage() {
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            login()
        }, 1000)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] opacity-20 pointer-events-none" />

            <div className="w-full max-w-md p-8 bg-card/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl relative z-10">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tighter">Join Thoughtsy</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">Start building your second brain.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Full Name</label>
                        <Input type="text" placeholder="Ada Lovelace" className="bg-background/50 border-white/10" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email</label>
                        <Input type="email" placeholder="ada@history.com" className="bg-background/50 border-white/10" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Password</label>
                        <Input type="password" placeholder="••••••••" className="bg-background/50 border-white/10" required />
                    </div>

                    <div className="pt-2">
                        <Button className="w-full h-11 text-base" disabled={isLoading}>
                            {isLoading ? 'Creating Brain...' : 'Create Account'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have a brain?{' '}
                    <Link to="/" className="text-primary hover:text-primary/80 font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}
