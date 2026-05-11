import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  SANITY_PROJECT_ID: z.string().min(1),
  SANITY_DATASET: z.string().min(1),
  SANITY_SECRET_TOKEN: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  GOOGLE_OAUTH_ID: z.string().min(1),
  GOOGLE_OAUTH_SECRET: z.string().min(1),
  GOOGLE_VERIFICATION_ID: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formatted = result.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment variables:\n${formatted}`);
}

export const env = result.data;
export type Env = z.infer<typeof envSchema>;
