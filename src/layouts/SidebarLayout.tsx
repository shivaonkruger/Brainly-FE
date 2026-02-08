import type { ReactNode, ElementType } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, FileText, Map, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarItemProps {
    icon: ElementType
    label: string
    href: string
    isActive: boolean
}

const SidebarItem = ({
    icon: Icon,
    label,
    href,
    isActive,
}: SidebarItemProps) => {
    return (
        <Link to={href} className="w-full">
            <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                    'w-full justify-start gap-3',
                    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
            >
                <Icon className="h-4 w-4" />
                {label}
            </Button>
        </Link>
    )
}

interface SidebarLayoutProps {
    children: ReactNode
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
    const location = useLocation()

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <div className="w-64 border-r border-sidebar-border bg-sidebar-background flex flex-col fixed inset-y-0 p-4">
                <div className="flex items-center gap-2 px-2 py-6 mb-4">
                    <div className="text-2xl font-bold tracking-tight text-sidebar-foreground flex items-center gap-2">
                        <Brain className="h-8 w-8 text-primary/80" />
                        Thoughtsy
                    </div>
                </div>

                <div className="flex-1 space-y-1">
                    <SidebarItem
                        icon={FileText}
                        label="Content"
                        href="/content"
                        isActive={location.pathname === '/content'}
                    />
                    <SidebarItem
                        icon={Map}
                        label="Roadmaps"
                        href="/roadmap"
                        isActive={location.pathname === '/roadmap'}
                    />
                    <SidebarItem
                        icon={CheckSquare}
                        label="To-do Lists"
                        href="/todo"
                        isActive={location.pathname === '/todo'}
                    />
                </div>

                <div className="mt-auto pt-4 border-t border-sidebar-border">
                    <div className="text-xs text-sidebar-foreground/50 px-2 py-4">
                        © 2024 Thoughtsy AI
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 min-h-screen bg-background">
                {children}
            </div>
        </div>
    )
}
