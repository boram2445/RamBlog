export const getMainImageUrl = (content: string) => {
  const markdownRegex = /!\[.*?\]\((https?:\/\/\S+)\)/;
  const htmlImgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/i;

  const markdownMatch = content.match(markdownRegex);
  const htmlMatch = content.match(htmlImgRegex);

  if (markdownMatch) {
    return markdownMatch[1];
  } else if (htmlMatch) {
    return htmlMatch[1];
  } else {
    return '';
  }
};
