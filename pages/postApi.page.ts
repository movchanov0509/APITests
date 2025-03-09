import { APIRequestContext, expect } from "@playwright/test";
import { PostProduct } from "./postProduct.interface";

export class PostApiPage { 
    private readonly context: APIRequestContext;
    private readonly baseUrl = 'https://dev.emeli.in.ua/wp-json/wp/v2';
    private readonly credential = Buffer.from('admin:Engineer_123').toString('base64');
    private readonly performanceTimeOut = 10000;

    constructor(context: APIRequestContext) {
        this.context = context;
    }

    private getHeaders() {
        return {
            'Authorization': `Basic ${this.credential}`,
            'Content-Type': 'application/json'
        }
    }
    
    async createPost(data: Partial<PostProduct>) { 
        const createStartTime = Date.now();
        const createResponse = await this.context.post(`${this.baseUrl}/posts`, {
            headers: this.getHeaders(),
            data
        })
        const createRealTime = Date.now() - createStartTime;
        return { createResponse, createRealTime };        
    }

    async updatePost(postId: number, data: Partial<PostProduct>) {
        const updateStartTime = Date.now();
        const updateResponse = await this.context.put(`${this.baseUrl}/posts/${postId}`, {
            headers: this.getHeaders(),
            data
        })
        const updateRealTime = Date.now() - updateStartTime;
        return { updateResponse, updateRealTime };
    }

    async getPost(postId: number) {
        const getStartTime = Date.now();
        const getResponse = await this.context.get(`${this.baseUrl}/posts/${postId}`, {
            headers: this.getHeaders()
        })
        const getRealTime = Date.now() - getStartTime;
        return { getResponse, getRealTime };
    }

    async deletePost(postId: number) {
        const deleteStartTime = Date.now();
        const deleteResponse = await this.context.delete(`${this.baseUrl}/posts/${postId}?force=true`, {
            headers: this.getHeaders()
        })
        const deleteRealTime = Date.now() - deleteStartTime;
        return { deleteResponse, deleteRealTime };
    }

    verifyCreatePost(createResponse: any, createRealTime: number, createData: Partial<PostProduct>) {
        expect(createRealTime).toBeLessThan(this.performanceTimeOut);
        expect(createResponse.status()).toBe(201);
        const createdPost = createResponse.json() as PostProduct;
        this.verifyPostAttributes(createdPost, createData);
    }
    private verifyPostAttributes(createdPost: PostProduct, createData: Partial<PostProduct>) { 
        expect(createdPost.title.rendered).toBe(createData.title);
        expect(createdPost.title.raw).toBe(createData.title);
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
        expect(createdPost.excerpt.protected).toBe(false);
        expect(createdPost.featured_media).toBeGreaterThanOrEqual(0);
        expect(createdPost.comment_status).toMatch(/open|closed/);
    }

    verifyUpdatePost(updateResponse: any, updateRealTime: number, updateData: Partial<PostProduct>) {
        expect(updateRealTime).toBeLessThan(this.performanceTimeOut);
        expect(updateResponse.status()).toBe(200);
        const updatedPost = updateResponse.json() as PostProduct;
        this.verifyPostAttributes(updatedPost, updateData);
    }

    verifyGetPost(getResponse: any, getRealTime: number, getPostId: number) {
        expect(getRealTime).toBeLessThan(this.performanceTimeOut);
        expect(getResponse.status()).toBe(200);
        const getPost = getResponse.json() as PostProduct;
        expect(getPost.id).toBe(getPostId);
    }

    verifyDeletePost(deleteResponse: any, deleteRealTime: number) {
        expect(deleteRealTime).toBeLessThan(this.performanceTimeOut);
        expect(deleteResponse.status()).toBe(200);
    }


}

declare global {
    const expect: typeof import('@playwright/test').expect;
}