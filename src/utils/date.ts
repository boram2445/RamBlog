export const getDate = (
  dateStr: string,
  type?: 'date' | 'time' | 'full' | 'month' | 'day'
) => {
  const newDate = new Date(dateStr);

  if (type === 'date' || type === 'time' || type === 'full') {
    const date = newDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (type === 'date') return date;

    let hours = ('0' + newDate.getHours()).slice(-2);
    let minutes = ('0' + newDate.getMinutes()).slice(-2);

    if (type === 'full') {
      return `${date} ${hours}:${minutes}`;
    } else if (type === 'time') {
      return `${hours}:${minutes}`;
    }
  } else if (type === 'month' || type === 'day') {
    let year = newDate.getFullYear();
    let month = ('0' + (newDate.getMonth() + 1)).slice(-2);
    let day = ('0' + newDate.getDate()).slice(-2);

    if (type === 'month') {
      return `${year}.${month}`;
    } else if (type === 'day') {
      return `${year}-${month}-${day}`;
    }
  }
  return '';
};
