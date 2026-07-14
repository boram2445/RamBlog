import { createClient } from '@sanity/client';
import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url';
import { env } from '@/lib/env';

export const client = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-08-14',
  token: env.SANITY_SECRET_TOKEN,
  perspective: 'published',
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source).width(800).url();
}

export const assetURL = `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2023-08-02/assets/images/${env.SANITY_DATASET}`;
