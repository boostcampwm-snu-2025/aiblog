const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePostData {
    title: string;
    content: string;
}

export interface UpdatePostData {
    title: string;
    content: string;
}

export const postsApi = {
    createPost: async (data: CreatePostData): Promise<Post> => {
        const response = await fetch(`${API_BASE_URL}/api/posts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create post');
        return response.json();
    },

    getPosts: async (): Promise<Post[]> => {
        const response = await fetch(`${API_BASE_URL}/api/posts/`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },

    getPost: async (id: number): Promise<Post> => {
        const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        return response.json();
    },

    updatePost: async (id: number, data: UpdatePostData): Promise<Post> => {
        const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update post');
        return response.json();
    },

    deletePost: async (id: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete post');
    },
};
