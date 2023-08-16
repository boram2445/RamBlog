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

// export async function getPrevPost(
//   currentPostId: string
// ): Promise<PostData | null> {
//   const prevPost = await client.fetch(
//     `*[_type == "post" &&  _id != "${currentPostId}" && _createdAt < now()] | order(publishedAt desc)[0]`
//   );

//   return prevPost || null;
// }

// export async function getNextPost(
//   currentPostId: string
// ): Promise<PostData | null> {
//   const nextPost = await client.fetch(
//     `*[_type == "post" && _id != "${currentPostId}" && _createdAt > now()] | order(publishedAt asc)[0]`
//   );

//   return nextPost || null;
// }

export async function getPostDetail(id: string): Promise<PostData> {
  // const prevPost = await getPrevPost(id);
  // const nextPost = await getNextPost(id);
  const prevPost = null;
  const nextPost = null;
  const postDetail = await client
    .fetch(`*[_type == "post" && _id == "${id}"][0]`)
    .then((post) => ({ ...post, mainImage: urlFor(post.mainImage) }));

  return { ...postDetail, prevPost, nextPost };
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
    ...(tagArr && { tags: tagArr }), // tagArr를 추가
    ...(content && { content }),
    ...(mainImage && { mainImage: { asset: { _ref: urlRes.document._id } } }),
  };
  console.log(newData);
  return client
    .patch(postId) //
    .set(newData) //
    .commit();
}
