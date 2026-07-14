export type Comment = {
  id: string;
  deleted: boolean;
  username: string;
  image?: string;
  authorId?: string;
  comment: string;
  type: 'loggedInUserComment' | 'guestComment';
  createdAt: Date;
  recomments?: Comment[];
};
