const TIME_ZONE = 'Asia/Seoul';
// KST 는 DST 가 없어 오프셋이 고정이다. TIME_ZONE 과 항상 같이 수정한다.
const UTC_OFFSET = '+09:00';

// 서버(Vercel 런타임은 UTC)와 브라우저 어디서 렌더링되든 같은 값이 나오도록
// 모든 포매터에 timeZone을 못박는다.
const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// hour12: false 는 ko-KR 에서 자정을 24로 뱉는 경우가 있어 hourCycle 을 쓴다.
const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const numericFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const getPart = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
) => parts.find((part) => part.type === type)?.value ?? '';

export const getDate = (
  dateStr: string,
  type?: 'date' | 'time' | 'full' | 'month' | 'day'
) => {
  const newDate = new Date(dateStr);

  // Intl.DateTimeFormat#format 은 유효하지 않은 Date 에 RangeError 를 던진다.
  if (Number.isNaN(newDate.getTime())) return '';

  if (type === 'date' || type === 'time' || type === 'full') {
    if (type === 'time') return timeFormatter.format(newDate);

    const date = dateFormatter.format(newDate);
    if (type === 'date') return date;

    return `${date} ${timeFormatter.format(newDate)}`;
  } else if (type === 'month' || type === 'day') {
    const parts = numericFormatter.formatToParts(newDate);
    const year = getPart(parts, 'year');
    const month = getPart(parts, 'month');

    if (type === 'month') {
      return `${year}.${month}`;
    } else if (type === 'day') {
      return `${year}-${month}-${getPart(parts, 'day')}`;
    }
  }
  return '';
};

// <time dateTime> 등 machine-readable 용도. 유효하지 않으면 속성을 생략하도록 undefined.
export const getIsoDate = (dateStr: string) => {
  const date = new Date(dateStr);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

// KST 달력 날짜(YYYY-MM-DD)와 현재 KST 시각을 합쳐 UTC ISO 문자열로 만든다.
// 날짜와 시각의 기준이 어긋나 하루가 밀리는 것을 막는다.
export const getIsoFromKstDate = (dateStr: string) => {
  const time = getDate(new Date().toISOString(), 'time');
  const instant = new Date(`${dateStr}T${time}:00${UTC_OFFSET}`);

  return Number.isNaN(instant.getTime())
    ? new Date().toISOString()
    : instant.toISOString();
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
