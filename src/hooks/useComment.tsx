import useSWR from 'swr';
import axios from 'axios';
import { Comment } from '@/service/comment';
import { useSWRConfig } from 'swr';

export default function useComment(postId: string) {
  const {
    data: comments,
    isLoading,
    error,
  } = useSWR<Comment[]>(`/api/comment/${postId}`);
  const { mutate } = useSWRConfig();

  const setComment = (
    isLoggedInUser: boolean,
    data: PostGuestComment | PostUserComment
  ) => {
    const postData = {
      ...data,
      type: isLoggedInUser ? 'loggedInUserComment' : 'guestComment',
    };

    axios
      .post(`/api/comment/${postId}`, postData)
      .then(() => mutate(`/api/comment/${postId}`));
  };

  const deleteComment = (commentId: string, parentCommentId?: string) => {
    let url = `/api/comment/${postId}?commentId=${commentId}${
      parentCommentId ? `&parentCommentId=${parentCommentId}` : ''
    }`;

    axios
      .delete(url) //
      .then(() => mutate(`/api/comment/${postId}`));
  };

  const checkPassword = async (data: PostPassword) => {
    return await axios.post(`/api/comment/${postId}/password`, data);
  };

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
