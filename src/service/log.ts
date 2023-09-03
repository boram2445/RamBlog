import { client, urlFor } from './sanity';

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
