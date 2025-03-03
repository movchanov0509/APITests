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

    test('life circle create, update, delete', async ({ request }) => {
        
        // 🔹 1️⃣ **СТВОРЕННЯ ПОСТА**
        const createStartTime = Date.now();
        const createData = {
            title: 'post Product',
            content: 'Testing content',
            status: 'publish'

        }

        const createResponse = await request.post(`${baseUrl}/posts`, {
            headers: {
                'Authorization': `Basic ${credential}`,
                'Content-Type': 'application/json'
            },

            data: createData
        })

        // ✅ **Перевірка всіх атрибутів створеного поста**

        const createRealTime = Date.now() - createStartTime;
        expect(createRealTime).toBeLessThan(performanceTimeOut);
        expect(createResponse.status()).toBe(201);
        const createdPost = await createResponse.json() as PostProduct;
        expect(createdPost.id).toBeTruthy();
        expect(createdPost.title.rendered).toBe(createData.title);
        expect(createdPost.title.raw).toBe(createData.title);

        // expect(createdPost.content.rendered).toBe(createData.content);
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
        // expect(createdPost.link).toContain('/posts/');

        // expect(createdPost.excerpt.raw).toBeTruthy();
        // expect(createdPost.excerpt.rendered).toBeTruthy();
        expect(createdPost.excerpt.protected).toBe(false);

        expect(createdPost.featured_media).toBeGreaterThanOrEqual(0);
        expect(createdPost.comment_status).toMatch(/open|closed/);
        expect(createdPost.ping_status).toMatch(/open|closed/);
        expect(createdPost.sticky).toBe(false);
        expect(createdPost.template).toBe('');
        expect(createdPost.format).toBe('standard');

        expect(createdPost.meta).toBeDefined();
        // expect(createdPost.meta.footness).toBeDefined();

        console.log(`was created id, ${createdPost.id}`)

        // 🔹 2️⃣ **ОНОВЛЕННЯ ПОСТА**
        const editStartTime = Date.now();
        const editData = {
            title: 'Updated Post Title',
            content: 'Updated content for the post',
            status: 'draft'
        }

        const editResponse = await request.put(`${baseUrl}/posts/${createdPost.id}`, {
            headers: {
                'Authorization': `Basic ${credential}`,
                'Content-Type': 'application/json'
            },

            data: editData
        })

        // ✅ **Перевірка оновленого поста**
        const editRealTime = Date.now() - editStartTime;
        expect(editRealTime).toBeLessThan(performanceTimeOut);
        expect(editResponse.status()).toBe(200);
        const editPost = await editResponse.json() as PostProduct;
        expect(editPost.title.raw).toBe(editData.title);
        expect(editPost.title.rendered).toBe(editData.title);        
        expect(editPost.id).toBe(createdPost.id);
        expect(editPost.status).toBe(editData.status);


        console.log(`was updated id, ${createdPost.id}`)
    
        // 🔹 3️⃣ **ВИДАЛЕННЯ ПОСТА (force=true)**
        const deleteStartTime = Date.now();

        const deleteResponse = await request.delete(`${baseUrl}/posts/${createdPost.id}?force=true`, {
            headers: {
                'Authorization': `Basic ${credential}`    
            }
        })

        const deleteJson = await deleteResponse.json();
        console.log(`🗑 Deleted ID: ${createdPost.id}`);

        // ✅ **Перевірка видаленого поста**
        const deleteRealTime = Date.now() - deleteStartTime;
        expect(deleteRealTime).toBeLessThan(performanceTimeOut);
        expect(deleteResponse.status()).toBe(200);
        expect(deleteJson.deleted).toBe(true);
        expect(deleteJson.previous.id).toBe(createdPost.id);
        expect(deleteJson.previous.title.raw).toBe(editData.title);

        // 🔹 4️⃣ **ПЕРЕВІРКА, ЩО ПОСТА НЕМАЄ**
        const checkDeletedResponse = await request.get(`${baseUrl}/posts/${createdPost.id}`, {
            headers: {
                'Authorization': `Basic ${credential}`
            }
        });

        expect(checkDeletedResponse.status()).toBe(404);
    })
})
