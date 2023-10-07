import { uploadImage } from '@/service/image';
import { client, urlFor } from './sanity';

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

const simpleLogProjection = `
  "id":_id,
  date,
  title,
  "image":photo,
  emotion,
  content,
  "username":author->username,
`;

const logProjection = `
  title,
  content,
  "username":author->username, 
  "userImage":author->image,
  "image":photo,
  "id":_id,
  date,
  emotion,
  "likes":likes[]->username,
`;

export async function getAllUserLogs(username: string) {
  return client
    .fetch(
      `*[_type == "log" && author->username=="${username}"]| order(date desc){${simpleLogProjection}}
      `,
      {},
      {
        cache: 'force-cache',
        next: { tags: [`log/${username}`] },
      }
    )
    .then((logs) =>
      logs.map((log: SimpleLog) => ({
        ...log,
        image: log.image ? urlFor(log.image) : '',
      }))
    );
}

export async function getUserEmotionLogs(username: string, emotion: Emotion) {
  return client
    .fetch(
      `*[_type == "log" && author->username=="${username}" && emotion == "${emotion}"]| order(date desc){${simpleLogProjection}}
      `,
      {},
      {
        cache: 'force-cache',
        next: { tags: [`log/${username}`] },
      }
    )
    .then((logs) =>
      logs.map((log: SimpleLog) => ({
        ...log,
        image: log.image ? urlFor(log.image) : '',
      }))
    );
}

export async function getUserEmotionLog(
  username: string,
  logId: string,
  emotion: Emotion
) {
  return client
    .fetch(
      `*[_type == "log" && author->username=="${username}" && emotion == "${emotion}" && _id == "${logId}"][0]{
      'currentLog':{${logProjection}},
      'nextLog': *[_type == 'log' && author->username =="${username}"  && emotion == "${emotion}" && date > ^.date][0]{ "id":_id},
      'previousLog': *[_type == 'log' && author->username =="${username}"  && emotion == "${emotion}" && date < ^.date]| order(date desc)[0]{ "id":_id}
      }
    `,
      {},
      {
        cache: 'force-cache',
        next: { tags: [`log/${username}`] },
      }
    )
    .then((log) => ({
      ...log,
      currentLog: {
        ...log.currentLog,
        image: log.currentLog.image ? urlFor(log.currentLog.image) : '',
      },
    }));
}

export async function getUserLog(username: string, logId: string) {
  return client
    .fetch(
      `*[_type == "log" && author->username=="${username}" && _id == "${logId}"][0]{
      'currentLog':{${logProjection}},
      'nextLog': *[_type == 'log' && author->username =="${username}" && date > ^.date][0]{ "id":_id},
      'previousLog': *[_type == 'log' && author->username =="${username}"  && date < ^.date] | order(date desc)[0]{ "id":_id}
      }`,
      {},
      {
        cache: 'force-cache',
        next: { tags: [`log/${username}`] },
      }
    )
    .then((log) => ({
      ...log,
      currentLog: {
        ...log.currentLog,
        image: log.currentLog.image ? urlFor(log.currentLog.image) : '',
      },
    }));
}

export async function createLog(
  userId: string,
  title: string,
  content: string,
  date: string,
  emotion?: string,
  file?: Blob
) {
  const res = file && (await uploadImage(file));

  let logCreateProjection = {
    _type: 'log',
    author: { _ref: userId },
    title,
    content,
    date,
    emotion,
  };

  let logCreateProjectionFile = file
    ? { ...logCreateProjection, photo: { asset: { _ref: res.document._id } } }
    : logCreateProjection;

  return client.create(logCreateProjectionFile, {
    autoGenerateArrayKeys: true,
  });
}

export async function deleteLog(logId: string) {
  return client.delete(logId);
}
