import { test, expect } from '@playwright/test';
import { PostApiPage } from '../pages/postApi.page';
import { PostProduct } from '../pages/postProduct.interface';



test.describe('post Product Test', () => {

    test('life circle create, update, delete', async ({ request }) => {
        const postApiPage = new PostApiPage(request);
        // Create post
        const createData: Partial<PostProduct> = {
            title: { raw: 'post Product', rendered: 'post Product' },
            content: { raw: 'Testing content', rendered: 'Testing content', protected: false, block_version: 0 },
            status: 'publish'
        };
        const { createResponse: createResponse, createRealTime: createRealTime } = await postApiPage.createPost(createData);
        expect(createResponse.status()).toBe(201);
        const createdPost = await createResponse.json();
        console.log(`✅ Created post with ID: ${createdPost.id}`);

        postApiPage.verifyCreatePost(createResponse, createRealTime, createData);

        // Update post
        const editData: Partial<PostProduct> = {
            title: { raw: 'post Product edited', rendered: 'post Product edited' },
            content: { raw: 'Testing content edited', rendered: 'Testing content edited', protected: false, block_version: 0 },
            status: 'publish'
        };

        const { updateResponse: updateResponse, updateRealTime: updateRealTime } = await postApiPage.updatePost(createdPost.id, editData);

        expect(updateResponse.status()).toBe(200);
        const updatedPost = await updateResponse.json();
        console.log(`Updated post with ID: ${updatedPost.id}`);

        postApiPage.verifyUpdatePost(updateResponse, updateRealTime, editData);

        // Get Updated Post
        const { getResponse, getRealTime } = await postApiPage.getPost(createdPost.id);

        expect(getResponse.status()).toBe(200);
        const fetchedPost = await getResponse.json();
        expect(fetchedPost.title.rendered).toBe(editData.title);
        console.log(`Verified post update with ID: ${fetchedPost.id}`);

        // Delete Post
        const { deleteResponse, deleteRealTime } = await postApiPage.deletePost(createdPost.id);

        expect(deleteResponse.status()).toBe(200);
        console.log(`Deleted post with ID: ${createdPost.id}`);

        postApiPage.verifyDeletePost(deleteResponse, deleteRealTime);

        // Verify Post Deletion
        const checkResponse = await postApiPage.getPost(createdPost.id);
        expect(checkResponse.getResponse.status()).toBe(404);
        console.log(`Verified deletion of post ID: ${createdPost.id}`);
    })
})


