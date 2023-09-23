import useSWR from 'swr';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { getMainImageUrl } from '@/utils/mainImage';
import { SimplePost } from '@/model/post';

export default function useUserPost(username: string, tag: string) {
  const url =
    tag === 'all'
      ? `/api/${username}/posts`
      : `/api/${username}/posts/tags/${tag}`;

  const { data: posts, isLoading, error } = useSWR<SimplePost[]>(url);
  const { mutate } = useSWRConfig();

  const writePost = useCallback(
    async (content: string, form: PostData, postId?: string) => {
      const imageUrl = getMainImageUrl(content);

      const formData = new FormData();
      imageUrl && formData.append('mainImageUrl', imageUrl);
      form.title.trim() && formData.append('title', form.title);
      form.description && formData.append('description', form.description);
      form.tags.length !== 0 && formData.append('tags', form.tags.join());
      content.trim() && formData.append('content', content);

      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      await axios
        .post(url, formData)
        .then(() => mutate(`/api/${username}/posts`));
    },
    [mutate, username]
  );

  return { posts, isLoading, error, writePost };
}

type PostData = {
  title: string;
  description: string;
  tags: string[];
};
