export type Portfolio = PostPortfolio & {
  id: string;
  username: string;
};

export type PostPortfolio = {
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
  image: string | File;
  link: string;
};
