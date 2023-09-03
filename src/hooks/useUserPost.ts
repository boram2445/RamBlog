import useSWR from 'swr';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { Post } from '@/service/posts';
import { getMainImageUrl } from '@/utils/mainImage';

export default function useUserPost(username: string, tag: string) {
  const url =
    tag === 'all'
      ? `/api/${username}/posts`
      : `/api/${username}/posts/tags/${tag}`;

  const { data: posts, isLoading, error } = useSWR<Post[]>(url);
  const { mutate } = useSWRConfig();

  const addPost = useCallback(
    async (content: string, form: PostData) => {
      const url = getMainImageUrl(content);

      const formData = new FormData();
      formData.append('mainImageUrl', url);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('tags', form.tags.join());
      formData.append('content', content);

      await axios.post('/api/posts', formData).then(() => {
        console.log('실행되나요');
        mutate(`/api/${username}/posts`);
      });
    },
    [mutate, username]
  );

  const editPost = useCallback(
    async (postId: string, content: string, form: PostData) => {
      const url = getMainImageUrl(content);

      const formData = new FormData();
      formData.append('mainImageUrl', url);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('tags', form.tags.join());
      formData.append('content', content);

      await axios
        .patch(`/api/posts/${postId}`, formData)
        .then(() => mutate(`/api/${username}/posts`));
    },
    [mutate, username]
  );

  return { posts, isLoading, error, addPost, editPost };
}

type PostData = {
  title: string;
  description: string;
  tags: string[];
};
