import { uploadImage } from '@/service/image';
import { client, urlFor } from './sanity';
import { Emotion, SimpleLog } from '@/model/log';

const simpleLogProjection = `
  "id":_id,
  date,
  title,
  "image":photo,
  emotion,
  content,
  "username":author->username,
  "slug":author->slug,
`;

const logProjection = `
  title,
  content,
  "username":author->username,
  "slug":author->slug,
  "userImage":author->image,
  "image":photo,
  "id":_id,
  date,
  emotion,
  "likes":likes[]->username,
`;

export async function getAllUserLogs(slug: string) {
  return client
    .fetch(
      `*[_type == "log" && author->slug == $slug]| order(date desc){${simpleLogProjection}}
      `,
      { slug },
      {
        cache: 'force-cache',
        next: { tags: [`log/${slug}`] },
      }
    )
    .then((logs) =>
      logs.map((log: SimpleLog) => ({
        ...log,
        image: log.image ? urlFor(log.image) : '',
      }))
    );
}

export async function getUserEmotionLogs(slug: string, emotion: Emotion) {
  return client
    .fetch(
      `*[_type == "log" && author->slug == $slug && emotion == $emotion]| order(date desc){${simpleLogProjection}}
      `,
      { slug, emotion },
      {
        cache: 'force-cache',
        next: { tags: [`log/${slug}`] },
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
  slug: string,
  logId: string,
  emotion: Emotion
) {
  return client
    .fetch(
      `*[_type == "log" && author->slug == $slug && emotion == $emotion && _id == $logId][0]{
      'currentLog':{${logProjection}},
      'nextLog': *[_type == 'log' && author->slug == $slug && emotion == $emotion && date > ^.date][0]{ "id":_id},
      'previousLog': *[_type == 'log' && author->slug == $slug && emotion == $emotion && date < ^.date]| order(date desc)[0]{ "id":_id}
      }
    `,
      { slug, emotion, logId },
      {
        cache: 'force-cache',
        next: { tags: [`log/${slug}`] },
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

export async function getUserLog(slug: string, logId: string) {
  return client
    .fetch(
      `*[_type == "log" && author->slug == $slug && _id == $logId][0]{
      'currentLog':{${logProjection}},
      'nextLog': *[_type == 'log' && author->slug == $slug && date > ^.date][0]{ "id":_id},
      'previousLog': *[_type == 'log' && author->slug == $slug && date < ^.date] | order(date desc)[0]{ "id":_id}
      }`,
      { slug, logId },
      {
        cache: 'force-cache',
        next: { tags: [`log/${slug}`] },
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
