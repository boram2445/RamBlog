export type Emotion = 'love' | 'happy' | 'normal' | 'bad' | 'heart';
export type SimpleLog = {
  image: string;
  id: string;
  title: string;
  date: Date;
  username: string;
  emotion: Emotion;
  // likes: number;
};

export type Log = {
  title: string;
  content: string;
  username: string;
  userImage: string;
  image: string;
  id: string;
  date: Date;
  emotion: Emotion;
  likes: string[];
};

export type DetailLog = {
  currentLog: Log;
  previousLog: { id: string };
  nextLog: { id: string };
};
