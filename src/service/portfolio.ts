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
  startDate: Date;
  endDate: Date;
  holding: boolean;
  content: string;
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
      businessExperiences,
      projects,
      educations,
    }`
  );
}
