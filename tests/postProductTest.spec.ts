import { test, expect } from '@playwright/test';


interface PostProduct{
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

test.describe('post Product Test', () => {
    const baseUrl = 'https://dev.emeli.in.ua/wp-json/wp/v2';
    // кодуємо наші креди з допомогою base64
    const credential = Buffer.from('admin:Engineer_123').toString('base64')
    const performanceTimeOut = 10000;

    test('life circle create, update, delete', async ({request}) => {
        const createStartTime = Date.now();
        const createData = {
            title: 'post Product',
            content: 'Testing content',
            status: 'publish'

        }

        const createResponce = await request.post(`${baseUrl}/posts`, {
            headers: {
                'Autorization': `Basic ${credential}`,
                'Content-Type': 'aplication/json'
            },

            data: createData
        })

        const createRealTime = Date.now() - createStartTime;
        expect(createRealTime).toBeLessThan(performanceTimeOut);
        expect(createResponce.status()).toBe(201);
        const createdPost = await createResponce.json() as PostProduct;
        expect(createdPost.id).toBeTruthy();
        expect(createdPost.title.rendered).toBe(createData.title);
        expect(createdPost.title.raw).toBe(createData.title);

        expect(createdPost.content.rendered).toBe(createData.content);
        expect(createdPost.content.raw).toBe(createData.content);
        expect(createdPost.content.protected).toBe(false);
        expect(createdPost.content.block_version).toBeGreaterThanOrEqual(0);

        expect(createdPost.author).toBeGreaterThan(0);

        expect(createdPost.date).toBeTruthy();
        expect(createdPost.date_gmt).toBeTruthy();
        expect(createdPost.guid).toBeTruthy();
        expect(createdPost.guid.rendered).toBeTruthy();
        expect(createdPost.guid.raw).toBeTruthy();
        expect(createdPost.modified).toBeTruthy();
        expect(createdPost.modified_gmt).toBeTruthy();
        expect(createdPost.password).toBe('');
        expect(createdPost.slug).toBeTruthy();
        expect(createdPost.status).toBe(createData.status);
        expect(createdPost.type).toBe('post');
        expect(createdPost.link).toContain('/posts/');

        expect(createdPost.excerpt.raw).toBeTruthy();
        expect(createdPost.excerpt.rendered).toBeTruthy();
        expect(createdPost.excerpt.protected).toBe(false);

        expect(createdPost.featured_media).toBeGreaterThanOrEqual(0);
        expect(createdPost.comment_status).toMatch(/open|closed/);
        expect(createdPost.ping_status).toMatch(/open|closed/);
        expect(createdPost.sticky).toBe(false);
        expect(createdPost.template).toBe('');
        expect(createdPost.format).toBe('standard');

        expect(createdPost.meta).toBeDefined();
        expect(createdPost.meta.footness).toBeDefined();

        console.log(`was created id, ${createdPost.id}`)

        const editStartTime = Date.now();
        const editData = {
            title: 'newTitle',
            content: 'NewContent',
            status: 'future'
        }

        const editRequest = await request.put(`${baseUrl}/posts/${createdPost.id}`, {
            headers: {
                'Autorization': `Basic ${credential}`,
                'Content-Type': 'aplication/json'
            },

            data: editData
        })

        const editRealTime = Date.now() - editStartTime;
        expect(editRealTime).toBeLessThan(performanceTimeOut);
        expect(createResponce.status()).toBe(201);
        const editPost = await createResponce.json() as PostProduct;
        expect(editPost.title.raw).toBe(editData.title);
        expect(editPost.title.rendered).toBe(editData.title);

        console.log(`was created id, ${createdPost.id}`)
    
    })
})
