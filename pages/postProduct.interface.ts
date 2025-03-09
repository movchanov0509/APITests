export interface PostProduct {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
        raw: string;
    },
    modified: string;
    modified_gmt: string;
    password: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
        raw: string;
        rendered: string;
    },
    content: {
        raw: string;
        rendered: string;
        protected: boolean;
        block_version: number;
    },
    excerpt: {
        raw: string;
        rendered: string;
        protected: boolean;
    },
    author: number,
    featured_media: number,
    comment_status: string,
    ping_status: string,
    sticky: boolean,
    template: string,
    format: string,
    meta: {
        footness: string
    },
    categories: [number],
    tags: [string]
}

