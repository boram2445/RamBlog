import { client, urlFor } from './sanity';
import { uploadImage } from './image';

export type Post = {
  title: string;
  description: string;
  mainImage: string;
  pinned: boolean;
  updatedAt: Date;
  createdAt: Date;
  tags: string[];
  id: string;
};

export type PostData = Post & {
  content: string;
  prev: Post | null;
  next: Post | null;
};

function mapPosts(posts: Post[]) {
  return posts.map((post: Post) => ({
    ...post,
    mainImage: urlFor(post.mainImage),
  }));
}

export async function getAllPostsData(): Promise<Post[]> {
  return client
    .fetch(
      `*[_type == "post"]| order(_createdAt desc){
      tags,
      title,
      pinned,
      mainImage,
      "updatedAt":_updatedAt,
      "createdAt":_createdAt,
      "id":_id
   }`
    )
    .then(mapPosts);
}

export async function getPrevPost(currentDate: string) {
  return await client
    .fetch(
      `*[_type == "post" && _createdAt > $currentDate] | order(_createdAt asc) [0]
    {
      tags,
      title,
      pinned,
      mainImage,
      "updatedAt":_updatedAt,
      "createdAt":_createdAt,
      "id":_id
   }
    `,
      { currentDate }
    )
    .then((post) =>
      post ? { ...post, mainImage: urlFor(post.mainImage) } : null
    );
}

export async function getNextPost(currentDate: string) {
  return await client
    .fetch(
      `*[_type == "post" && _createdAt < $currentDate] | order(_createdAt desc) [0]
      {
        tags,
        title,
        pinned,
        mainImage,
        "updatedAt":_updatedAt,
        "createdAt":_createdAt,
        "id":_id
     }
      `,
      { currentDate }
    )
    .then((post) =>
      post ? { ...post, mainImage: urlFor(post.mainImage) } : null
    );
}

export async function getPostDetail(id: string): Promise<PostData> {
  const postDetail = await client
    .fetch(
      `*[_type == "post" && _id == "${id}"][0]{
        ...,
        "updatedAt":_updatedAt,
        "createdAt":_createdAt,
        "id":_id}
      `
    )
    .then((post) => ({ ...post, mainImage: urlFor(post.mainImage) }));
  const prevPost = await getPrevPost(postDetail.createdAt);
  const nextPost = await getNextPost(postDetail.createdAt);

  return { ...postDetail, prev: prevPost, next: nextPost };
}

export async function createPost(
  title: string,
  description: string,
  tagArr: string[],
  content: string,
  mainImage: Blob
) {
  const urlRes = await uploadImage(mainImage);

  return client.create(
    {
      _type: 'post',
      title,
      pinned: false,
      description,
      tags: tagArr,
      content,
      mainImage: { asset: { _ref: urlRes.document._id } },
    },
    { autoGenerateArrayKeys: true }
  );
}

export async function editPost(
  postId: string,
  title?: string,
  description?: string,
  tagArr?: string[],
  content?: string,
  mainImage?: Blob
) {
  const urlRes = mainImage && (await uploadImage(mainImage));
  const newData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(tagArr && { tags: tagArr }),
    ...(content && { content }),
    ...(mainImage && { mainImage: { asset: { _ref: urlRes.document._id } } }),
  };
  return client
    .patch(postId) //
    .set(newData) //
    .commit();
}
