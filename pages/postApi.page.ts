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
        };
    }

    async createPost(data: Partial<PostProduct>) {
        try {
            const createStartTime = Date.now();
            const createResponse = await this.context.post(`${this.baseUrl}/posts`, {
                headers: this.getHeaders(),
                data,
                timeout: this.performanceTimeOut
            });
            const createRealTime = Date.now() - createStartTime;
            return { createResponse, createRealTime };
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    }

    async updatePost(postId: number, data: Partial<PostProduct>) {
        try {
            const updateStartTime = Date.now();
            const updateResponse = await this.context.put(`${this.baseUrl}/posts/${postId}`, {
                headers: this.getHeaders(),
                data,
                timeout: this.performanceTimeOut
            });
            const updateRealTime = Date.now() - updateStartTime;
            return { updateResponse, updateRealTime };
        } catch (error) {
            console.error(`Error updating post ${postId}:`, error);
            throw error;
        }
    }

    async getPost(postId: number) {
        try {
            const getStartTime = Date.now();
            const getResponse = await this.context.get(`${this.baseUrl}/posts/${postId}`, {
                headers: this.getHeaders(),
                timeout: this.performanceTimeOut
            });
            const getRealTime = Date.now() - getStartTime;
            return { getResponse, getRealTime };
        } catch (error) {
            console.error(`Error fetching post ${postId}:`, error);
            throw error;
        }
    }

    async deletePost(postId: number) {
        try {
            const deleteStartTime = Date.now();
            const deleteResponse = await this.context.delete(`${this.baseUrl}/posts/${postId}?force=true`, {
                headers: this.getHeaders(),
                timeout: this.performanceTimeOut
            });
            const deleteRealTime = Date.now() - deleteStartTime;
            return { deleteResponse, deleteRealTime };
        } catch (error) {
            console.error(`Error deleting post ${postId}:`, error);
            throw error;
        }
    }

    private verifyPostAttributes(post: PostProduct, expectedData: Partial<PostProduct>) {
        expect(post.title.rendered).toBe(expectedData.title);
        expect(post.content.rendered).toBe(expectedData.content);
        expect(post.status).toBe(expectedData.status);
        expect(post.type).toBe("post");
    }

    verifyCreatePost(createResponse: any, createRealTime: number, createData: Partial<PostProduct>) {
        expect(createRealTime).toBeLessThan(this.performanceTimeOut);
        expect(createResponse.status()).toBe(201);
        const createdPost = createResponse.json() as PostProduct;
        this.verifyPostAttributes(createdPost, createData);
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
        const deletedPost = deleteResponse.json();
        expect(deletedPost.deleted).toBe(true);
    }
}
