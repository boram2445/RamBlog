'use client';

import { Post } from '@/service/posts';
import { useState } from 'react';
import PostCard from './PostCard';
import Categories from './Categories';

type Props = {
  posts: Post[];
  categories: string[];
};

const ALL_POSTS = 'all posts';

export default function FilterablePosts({ posts, categories }: Props) {
  const [selected, setSelected] = useState(ALL_POSTS);
  // const filteredPosts =
  //   selected === ALL_POSTS
  //     ? posts
  //     : posts.filter((post) => post.category === selected);

  return (
    <div className='flex flex-col-reverse mx-auto tablet:flex-row'>
      <ul className='p-5 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-x-3 gap-y-10'>
        {/* {filteredPosts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))} */}
      </ul>
      <Categories
        categories={[ALL_POSTS, ...categories]}
        selected={selected}
        onClick={setSelected}
      />
    </div>
  );
}
