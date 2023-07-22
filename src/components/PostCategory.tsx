'use client';

import { Post } from '@/service/posts';
import { useState } from 'react';
import PostCard from './PostCard';

export default function PostCategory({ posts }: { posts: Post[] }) {
  const [selectedCateogory, setSelectedCategory] = useState(categories[0]);
  const categoryPosts = posts.filter(
    (post) => post.category === selectedCateogory
  );

  return (
    <>
      <section className='p-5 grid grid-cols-3 gap-6'>
        {selectedCateogory === categories[0] &&
          posts.map((post, index) => <PostCard key={index} post={post} />)}
        {categoryPosts?.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </section>

      <section className='py-5 px-8'>
        <h3 className='pb-2 mb-3 border-b border-brown '>Cateogry</h3>
        <ul>
          {categories.map((category, index) => (
            <li
              key={index}
              className={`cursor-pointer hover:text-brown ${
                selectedCateogory === category && 'text-brown'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

//수정 필요
const categories = [
  'all Post',
  'my story',
  'javascript',
  'backend',
  'frontend',
];
