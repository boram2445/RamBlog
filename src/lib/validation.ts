import { z } from 'zod';

// Sanity `_key`는 자동 생성 시 영숫자(+ `-`/`_`) 조합 — patch path selector에
// 클라이언트 입력을 보간하기 전 형식을 강제해 임의 표현식 주입을 막는다.
export const commentKeySchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/);

// bcrypt는 72바이트를 초과하는 입력을 조용히 잘라내므로 max 72로 제한.
export const passwordSchema = z.string().min(8).max(72);

export const registerSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  password: passwordSchema,
});

export const guestCommentPasswordSchema = passwordSchema;

// URL `?page=` 는 사용자가 직접 만질 수 있는 값 — 잘못된 입력에 404를 내는 대신
// 1페이지로 폴백시킨다. `.catch(1)` 이라 abc/0/-1/빈값 모두 throw 없이 1이 된다.
export const pageParamSchema = z.coerce.number().int().min(1).catch(1);
