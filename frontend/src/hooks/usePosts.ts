import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi, type CreatePostData, type UpdatePostData } from '../api/posts';

export const usePosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: postsApi.getPosts,
    });
};

export const usePost = (id: number) => {
    return useQuery({
        queryKey: ['posts', id],
        queryFn: () => postsApi.getPost(id),
        enabled: !!id,
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePostData) => postsApi.createPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePostData }) => postsApi.updatePost(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => postsApi.deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};
