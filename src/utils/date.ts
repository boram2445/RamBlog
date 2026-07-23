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

const RELATIVE_TIME_UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: 'year', seconds: 60 * 60 * 24 * 365 },
  { unit: 'month', seconds: 60 * 60 * 24 * 30 },
  { unit: 'week', seconds: 60 * 60 * 24 * 7 },
  { unit: 'day', seconds: 60 * 60 * 24 },
  { unit: 'hour', seconds: 60 * 60 },
  { unit: 'minute', seconds: 60 },
];

const relativeTimeFormatter = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

export const getRelativeTime = (dateStr: string) => {
  const diffSeconds = (new Date(dateStr).getTime() - Date.now()) / 1000;

  for (const { unit, seconds } of RELATIVE_TIME_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return relativeTimeFormatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return relativeTimeFormatter.format(Math.round(diffSeconds), 'second');
};
