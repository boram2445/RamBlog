export const getDate = (
  dateStr: string,
  type?: 'date' | 'time' | 'full' | 'month'
) => {
  const newDate = new Date(dateStr);
  const date = newDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (type === 'date') return date;

  let hours = ('0' + newDate.getHours()).slice(-2);
  let minutes = ('0' + newDate.getMinutes()).slice(-2);

  if (type === 'full') return `${date} ${hours}:${minutes}`;
  else if (type === 'time') return `${hours}:${minutes}`;

  let year = newDate.getFullYear();
  let month = ('0' + (newDate.getMonth() + 1)).slice(-2);
  if (type === 'month') return `${year}.${month}`;
};
