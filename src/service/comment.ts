import { client } from './sanity';

export type Comment = {
  id: string;
  username: string;
  image?: string;
  comment: string;
  type: 'loggedInUserComment' | 'guestComment';
  createdAt: Date;
  recomments: number;
};

export async function getPostComments(postId: string) {
  return await client.fetch(
    `*[_type == "post" && _id == "${postId}"][0]{
      "comments": comments[]{
        createdAt,
        "id":_key,
        "comment": comment,
        "type":_type,
        _type == 'loggedInUserComment' => {
          "username":author->username,
          "image":author->image
        },
        _type == 'guestComment' => {
          "username":name
        },
        "recomments": count(comments),
      },
    }.comments`
  );
}
