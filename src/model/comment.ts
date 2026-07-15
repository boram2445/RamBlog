export type Comment = {
  id: string;
  deleted: boolean;
  username: string;
  slug?: string;
  image?: string;
  authorId?: string;
  comment: string;
  type: 'loggedInUserComment' | 'guestComment';
  createdAt: Date;
  recomments?: Comment[];
};
