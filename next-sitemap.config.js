const { createClient } = require('@sanity/client');

// next-sitemap의 postbuild 스크립트는 next build와 별개의 순수 Node 프로세스라
// src/service/sanity.ts의 client를 재사용할 수 없다 (server-only, @/ alias, zod 검증에 의존).
// 그래서 여기서 공개 데이터 조회 전용 client를 별도로 만든다.
const sanityClient =
  process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET
    ? createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
        apiVersion: '2023-08-14',
        useCdn: true,
      })
    : null;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ram-blog.vercel.app',
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    if (!sanityClient) {
      console.warn(
        '[next-sitemap] SANITY_PROJECT_ID/SANITY_DATASET 없음 — 동적 URL(포스트/유저/태그) 생략, 정적 라우트만 생성'
      );
      return [];
    }

    try {
      const [posts, usernames, tagNames] = await Promise.all([
        sanityClient.fetch(
          `*[_type == "post" && defined(author->username)]{ "id":_id, "username":author->username, "updatedAt":_updatedAt }`
        ),
        sanityClient.fetch(`*[_type == "user" && defined(username)].username`),
        sanityClient.fetch(`array::unique(*[_type == "post"].tags[]->tagName)`),
      ]);

      const postFields = await Promise.all(
        posts.map((post) =>
          config.transform(config, `/${post.username}/posts/${post.id}`).then((field) => ({
            ...field,
            lastmod: new Date(post.updatedAt).toISOString(),
          }))
        )
      );

      const userFields = await Promise.all(
        usernames.map((username) => config.transform(config, `/${username}`))
      );

      const tagFields = await Promise.all(
        tagNames
          .filter(Boolean)
          .map((tagName) => config.transform(config, `/tags/${encodeURIComponent(tagName)}`))
      );

      return [...postFields, ...userFields, ...tagFields];
    } catch (error) {
      console.warn('[next-sitemap] Sanity fetch 실패 — 정적 라우트만 생성:', error.message);
      return [];
    }
  },
};
