import { uploadImage } from '@/service/image';
import axios from 'axios';
import { assetURL, client, urlFor } from './sanity';

export type Log = {
  title: string;
  content: string;
  image: string;
  username: string;
  userImage: string;
  id: string;
  createdAt: Date;
};

const logProjection = `
  title,
  content,
  "username":author->username, 
  "userImage":author->image,
  "image":photo,
  "id":_id,
  "createdAt":_createdAt
`;

export async function getAllUserLogs(username: string) {
  return client
    .fetch(
      `*[_type == "log" && author->username=="${username}"]| order(_createdAt desc){${logProjection}}`
    )
    .then((logs) =>
      logs.map((log: Log) => ({
        ...log,
        image: log.image ? urlFor(log.image) : '',
      }))
    );
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
