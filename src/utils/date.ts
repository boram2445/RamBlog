export const getDate = (dateStr: string, type?: 'date' | 'time' | 'full') => {
  const newDate = new Date(dateStr);
  const date = newDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (type === 'date') return date;

  let hours = ('0' + newDate.getHours()).slice(-2);
  let minutes = ('0' + newDate.getMinutes()).slice(-2);

  return type === 'full'
    ? `${date} ${hours}:${minutes}`
    : `${hours}:${minutes}`;
};
