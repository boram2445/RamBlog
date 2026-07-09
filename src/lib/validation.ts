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
