import { SidebarLayout } from '@/layouts/SidebarLayout'
import { Button } from '@/components/ui/button'
import { Share2, Plus, Map } from 'lucide-react'

export default function RoadmapPage() {
    return (
        <SidebarLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Roadmaps</h1>
                        <p className="text-muted-foreground">Plan your learning journey.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Brain
                        </Button>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Roadmap
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-xl bg-card/50 min-h-[400px]">
                    <div className="bg-secondary/50 p-4 rounded-full mb-4">
                        <Map className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No roadmaps yet</h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-md">
                        Start by creating a roadmap to track your progress on complex topics.
                    </p>
                    <Button>Create Your First Roadmap</Button>
                </div>
            </div>
        </SidebarLayout>
    )
}
