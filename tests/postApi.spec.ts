import { test, expect } from '@playwright/test';
import { PostApiPage } from '../pages/postApi.page';
import { PostProduct } from '../pages/postProduct.interface';

test.describe('Post Product Test', () => {

    test('life cycle: create, update, delete', async ({ request }) => {
        const postApiPage = new PostApiPage(request);

        // Create post
        const createData  = {
            title: 'post Product',
            content: 'Testing content',
            status: 'publish'
        };

        const { createResponse, createRealTime } = await postApiPage.createPost(createData);
        expect(createResponse.ok()).toBeTruthy();
        expect(createResponse.status()).toBe(201);

        const createdPost = await createResponse.json();
        console.log('Created Post Response:', createdPost);
        expect(createdPost.id).toBeTruthy();

        postApiPage.verifyCreatePost(createResponse, createRealTime, createData);

        // Update post
        const editData = {
            title: 'post Product edited',
            content: 'Testing content edited',
            status: 'publish'
        };

        const { updateResponse, updateRealTime } = await postApiPage.updatePost(createdPost.id, editData);
        expect(updateResponse.ok()).toBeTruthy();
        expect(updateResponse.status()).toBe(200);

        const updatedPost = await updateResponse.json();
        console.log(`Updated post with ID: ${updatedPost.id}`);

        postApiPage.verifyUpdatePost(updateResponse, updateRealTime, editData);

        // Get Updated Post
        const { getResponse, getRealTime } = await postApiPage.getPost(createdPost.id);
        expect(getResponse.ok()).toBeTruthy();
        expect(getResponse.status()).toBe(200);

        const fetchedPost = await getResponse.json();
        expect(fetchedPost.title.rendered).toBe(editData.title.rendered);
        console.log(`Verified post update with ID: ${fetchedPost.id}`);

        // Delete Post
        const { deleteResponse, deleteRealTime } = await postApiPage.deletePost(createdPost.id);
        expect(deleteResponse.ok()).toBeTruthy();
        expect(deleteResponse.status()).toBe(200);
        console.log(`Deleted post with ID: ${createdPost.id}`);

        postApiPage.verifyDeletePost(deleteResponse, deleteRealTime);

        // Verify Post Deletion
        const { getResponse: checkResponse } = await postApiPage.getPost(createdPost.id);
        expect(checkResponse.status()).toBe(404);
        console.log(`Verified deletion of post ID: ${createdPost.id}`);
    });
});
