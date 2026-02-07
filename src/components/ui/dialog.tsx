import * as React from "react"
import { X } from "lucide-react"

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg transform rounded-2xl border border-white/10 bg-card p-6 shadow-2xl transition-all font-sans">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-secondary/50 transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>

                {children}
            </div>
        </div>
    )
}
