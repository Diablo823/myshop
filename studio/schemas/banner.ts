// studio/schemas/banner.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'banner',
  title: 'Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      description: 'Internal title for identifying this banner',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bannerType',
      title: 'Banner Type',
      type: 'string',
      options: {
        list: [
          { title: 'Single Banner', value: 'single' },
          { title: 'Carousel Banner', value: 'carousel' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slides',
      title: 'Banner Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'slide',
          title: 'Slide',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Redirect URL',
              type: 'string',
              description: 'URL where users will be redirected when clicking the banner',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'backgroundGradient',
              title: 'Background Gradient',
              type: 'string',
              description: 'Tailwind CSS gradient classes (e.g., bg-gradient-to-r from-yellow-50 to-pink-50)',
              initialValue: '',
            },
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'image',
              url: 'url',
            },
            prepare(selection) {
              const { title, media, url } = selection
              return {
                title: title,
                subtitle: `Links to: ${url}`,
                media: media,
              }
            },
          },
        },
      ],
      validation: (Rule) => 
        Rule.custom((slides, context) => {
          const bannerType = (context.parent as any)?.bannerType
          if (bannerType === 'single' && slides && slides.length > 1) {
            return 'Single banner can only have one slide'
          }
          if (bannerType === 'carousel' && slides && slides.length < 2) {
            return 'Carousel banner must have at least 2 slides'
          }
          return true
        }),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Only active banners will be displayed on the website',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which banners appear on the page (lower numbers appear first)',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      bannerType: 'bannerType',
      isActive: 'isActive',
      media: 'slides.0.image',
    },
    prepare(selection) {
      const { title, bannerType, isActive, media } = selection
      return {
        title: title,
        subtitle: `${bannerType} - ${isActive ? 'Active' : 'Inactive'}`,
        media: media,
      }
    },
  },
})