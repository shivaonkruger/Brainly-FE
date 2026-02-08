import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog } from '@/components/ui/dialog'
import { SidebarLayout } from '@/layouts/SidebarLayout'
import { Plus, Share2, ExternalLink, Trash2, Edit2, Youtube, Twitter, FileText } from 'lucide-react'
import type { Thought, ContentType } from '@/types'

// Dummy Data
const INITIAL_THOUGHTS: Thought[] = [
    {
        id: '1',
        title: 'Understanding React Server Components',
        description: 'Deep dive into how RSC works under the hood. Notes on streaming and data fetching patterns.',
        links: ['https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023'],
        type: 'youtube',
        createdAt: new Date()
    },
    {
        id: '2',
        title: 'Design System Architecture',
        description: 'Key takeawys from Linear design system talk. Consistency is key.',
        links: ['https://linear.app/method/design'],
        type: 'twitter',
        createdAt: new Date()
    }
]

export default function ContentPage() {
    const [thoughts, setThoughts] = useState<Thought[]>(INITIAL_THOUGHTS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [link, setLink] = useState('')
    const [type, setType] = useState<ContentType>('youtube')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newThought: Thought = {
            id: Date.now().toString(),
            title,
            description,
            links: [link],
            type,
            createdAt: new Date()
        }
        setThoughts([newThought, ...thoughts])
        setIsModalOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setLink('')
        setType('youtube')
    }

    const handleDelete = (id: string) => {
        setThoughts(thoughts.filter(t => t.id !== id))
    }

    const getTypeColor = (type: ContentType) => {
        switch (type) {
            case 'youtube': return 'bg-youtube';
            case 'twitter': return 'bg-twitter';
            case 'content': return 'bg-card'; // content type fallback
            default: return 'bg-card'
        }
    }

    const getTypeIcon = (type: ContentType) => {
        switch (type) {
            case 'youtube': return <Youtube className="h-4 w-4" />
            case 'twitter': return <Twitter className="h-4 w-4" />
            default: return <FileText className="h-4 w-4" />
        }
    }

    return (
        <SidebarLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">My Second Brain</h1>
                        <p className="text-muted-foreground">All your memories, in one place.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Brain
                        </Button>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Content
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {thoughts.map((thought) => (
                        <Card key={thought.id} className="overflow-hidden border-0 shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl group flex flex-col h-full bg-card">
                            <div className={`p-6 ${getTypeColor(thought.type)} text-white relative flex-1 flex flex-col`}>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                                        {getTypeIcon(thought.type)}
                                        {thought.type.charAt(0).toUpperCase() + thought.type.slice(1)}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-black/20 rounded-md transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                                        <button onClick={() => handleDelete(thought.id)} className="p-1.5 hover:bg-black/20 rounded-md transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
                                    {thought.title}
                                </h3>

                                <p className="text-white/90 text-sm mb-6 flex-1 line-clamp-4 leading-relaxed">
                                    {thought.description}
                                </p>

                                <div className="pt-4 mt-auto border-t border-white/20">
                                    <a href={thought.links[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-medium text-white/90 hover:text-white transition-colors">
                                        <ExternalLink className="h-3 w-3" />
                                        Open Source
                                    </a>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Thought">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                placeholder="Enter title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <div className="flex gap-2">
                                {(['youtube', 'twitter', 'content'] as ContentType[]).map(t => (
                                    <button
                                        type="button"
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-accent'}`}
                                    >
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link</label>
                            <Input
                                placeholder="https://..."
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                placeholder="Write your thoughts..."
                                className="min-h-[100px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Add Thought</Button>
                        </div>
                    </form>
                </Dialog>
            </div>
        </SidebarLayout>
    )
}
