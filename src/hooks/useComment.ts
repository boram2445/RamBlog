import useSWR from 'swr';
import axios from 'axios';
import { Comment } from '@/model/comment';
import { useSWRConfig } from 'swr';
import { useCallback } from 'react';

export default function useComment(postId: string) {
  const {
    data: comments,
    isLoading,
    error,
  } = useSWR<Comment[]>(`/api/comment/${postId}`);
  const { mutate } = useSWRConfig();

  const setComment = useCallback(
    (isLoggedInUser: boolean, data: PostGuestComment | PostUserComment) => {
      const postData = {
        ...data,
        type: isLoggedInUser ? 'loggedInUserComment' : 'guestComment',
      };

      axios
        .post(`/api/comment/${postId}`, postData)
        .then(() => mutate(`/api/comment/${postId}`));
    },
    [mutate, postId]
  );

  const deleteComment = useCallback(
    async (commentId: string, parentCommentId?: string) => {
      let url = `/api/comment/${postId}?commentId=${commentId}${
        parentCommentId ? `&parentCommentId=${parentCommentId}` : ''
      }`;

      await axios
        .delete(url) //
        .then(() => mutate(`/api/comment/${postId}`));
    },
    [mutate, postId]
  );

  const checkPassword = useCallback(
    async (data: PostPassword) => {
      return await axios.post(`/api/comment/${postId}/password`, data);
    },
    [postId]
  );

  return {
    comments,
    isLoading,
    error,
    setComment,
    deleteComment,
    checkPassword,
  };
}

type PostGuestComment = {
  text: string;
  name: string;
  password: string;
  commentId?: string;
};

type PostUserComment = {
  text: string;
  commentId?: string;
};

type PostPassword = {
  parentCommentId?: string;
  commentId: string;
  password: string;
};
