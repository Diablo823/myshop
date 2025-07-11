import { createClient } from '@sanity/client';
import imageBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 'n1gajtr7',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-01-01'
});

const builder = imageBuilder(client);

export const urlFor = (source: any) => {
    return builder.image(source);
}