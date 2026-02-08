export type ContentType = 'youtube' | 'twitter' | 'content';

export interface Thought {
    id: string;
    title: string;
    description: string;
    links: string[];
    type: ContentType;
    createdAt: Date;
}
