import { env } from "@/lib/env";
import type { PostDetail } from "@/model/post";

type JsonJProps = {
  currentPost: PostDetail;
  user: string;
};

export default function JsonLd({ currentPost, user }: JsonJProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: currentPost.title,
    description: currentPost.description,
    image: currentPost.mainImage ? currentPost.mainImage : undefined,
    datePublished: new Date(currentPost.createdAt).toISOString(),
    dateModified: new Date(currentPost.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: currentPost.username,
      url: `${env.NEXTAUTH_URL}/${currentPost.slug}`,
    },
    mainEntityOfPage: `${env.NEXTAUTH_URL}/${user}/posts/${currentPost.id}`,
    keywords: (currentPost.tags ?? []).join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
