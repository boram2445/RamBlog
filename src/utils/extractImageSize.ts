export function extractImageSize(imageUrl: string) {
  const match = imageUrl.match(/-(\d+)x(\d+)\./);
  const width = match ? parseInt(match[1], 10) : null;
  const height = match ? parseInt(match[2], 10) : null;

  return { width, height };
}
