import { Portfolio, PostPortfolio } from '@/model/portfolio';
import { client } from './sanity';

export async function getUserPortfolio(slug: string): Promise<Portfolio> {
  return client.fetch(
    `*[_type == "portfolio" && author->slug == $slug][0]{
      "id":_id,
      "username":author->username,
      "slug":author->slug,
      skills,
      introduce,
      businessExperiences[]{...,"id":_key},
      projects[]{...,"id":_key},
      educations[]{...,"id":_key},
    }`,
    { slug },
    {
      cache: 'force-cache',
      next: { tags: [`about/${slug}`] },
    }
  );
}

export async function createPortfolio(userId: string, formData: PostPortfolio) {
  return client.create({
    _type: 'portfolio',
    author: { _ref: userId },
    ...formData,
  });
}

export async function editPortfolio(
  portfolioId: string,
  newData: PostPortfolio
) {
  return client
    .patch(portfolioId)
    .set(newData)
    .commit({ autoGenerateArrayKeys: true });
}
