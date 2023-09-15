import { client } from './sanity';

export type Portfolio = {
  id: string;
  username: string;
  skills: string[];
  introduce: string;
  businessExperiences: Experience[];
  projects: Project[];
  educations: Experience[];
};

export type Experience = {
  name: string;
  startDate: string;
  endDate: string;
  holding: boolean;
  content: string;
  id: string;
};

export type Project = Experience & {
  image: string;
  link: string;
};

export async function getUserPortfolio(username: string): Promise<Portfolio> {
  return client.fetch(
    `*[_type == "portfolio" && author->username=="${username}"][0]{
      "id":_id,
      "username":author->username, 
      skills,
      introduce,
      businessExperiences[]{...,"id":_key},
      projects[]{...,"id":_key},
      educations[]{...,"id":_key},
    }`,
    {},
    {
      cache: 'force-cache',
      next: { tags: ['about'] },
    }
  );
}

export async function createPortfolio(userId: string, formData: Experience) {
  return client.create({
    _type: 'portfolio',
    author: { _ref: userId },
    ...formData,
  });
}

export async function editPortfolio(portfolioId: string, newData: Experience) {
  return client
    .patch(portfolioId)
    .set(newData)
    .commit({ autoGenerateArrayKeys: true });
}
