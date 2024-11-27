// import type { CollectionConfig } from 'payload/types'

// import { admins } from '../../access/admins'
// import { adminsOrPublished } from '../../access/adminsOrPublished'
// import { Archive } from '../../blocks/ArchiveBlock'
// import { CallToAction } from '../../blocks/CallToAction'
// import { Content } from '../../blocks/Content'
// import { ContentMedia } from '../../blocks/ContentMedia'
// import { MediaBlock } from '../../blocks/MediaBlock'
// import { hero } from '../../fields/hero'
// import { slugField } from '../../fields/slug'
// import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
// //import { populatePublishedDate } from '../../hooks/populatePublishedDate'
// import { populatePublishedAt } from '../../hooks/populatePublishedAt'
// import { populateAuthors } from './hooks/populateAuthors'
// import { revalidatePost } from './hooks/revalidatePost'

// export const Posts: CollectionConfig = {
//   access: {
//     create: admins,
//     delete: () => false,
//     read: adminsOrPublished,
//     update: admins,
//   },
//   admin: {
//     defaultColumns: ['title', 'slug', 'updatedAt'],
//     livePreview: {
//       url: ({ data }) => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/posts/${data?.slug}`,
//     },
//     preview: (doc) => {
//       return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
//         `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/posts/${doc?.slug as string}`,
//       )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
//     },
//     useAsTitle: 'title',
//   },
//   fields: [
//     {
//       name: 'title',
//       required: true,
//       type: 'text',
//     },
//     {
//       name: 'categories',
//       admin: {
//         position: 'sidebar',
//       },
//       hasMany: true,
//       relationTo: 'categories',
//       type: 'relationship',
//     },
//     {
//       name: 'publishedOn',
//       admin: {
//         date: {
//           pickerAppearance: 'dayAndTime',
//         },
//         position: 'sidebar',
//       },
//       hooks: {
//         beforeChange: [
//           ({ siblingData, value }) => {
//             if (siblingData._status === 'published' && !value) {
//               return new Date()
//             }
//             return value
//           },
//         ],
//       },
//       type: 'date',
//     },
//     {
//       name: 'authors',
//       admin: {
//         position: 'sidebar',
//       },
//       hasMany: true,
//       relationTo: 'users',
//       required: true,
//       type: 'relationship',
//     },
//     // This field is only used to populate the user data via the `populateAuthors` hook
//     // This is because the `user` collection has access control locked to protect user privacy
//     // GraphQL will also not return mutated user data that differs from the underlying schema
//     {
//       name: 'populatedAuthors',
//       access: {
//         update: () => false,
//       },
//       admin: {
//         disabled: true,
//         readOnly: true,
//       },
//       fields: [
//         {
//           name: 'id',
//           type: 'text',
//         },
//         {
//           name: 'name',
//           type: 'text',
//         },
//       ],
//       type: 'array',
//     },
//     {
//       tabs: [
//         {
//           fields: [hero],
//           label: 'Hero',
//         },
//         {
//           fields: [
//             {
//               name: 'layout',
//               blocks: [CallToAction, Content, ContentMedia, MediaBlock, Archive],
//               required: true,
//               type: 'blocks',
//             },
//             {
//               name: 'enablePremiumContent',
//               label: 'Enable Premium Content',
//               type: 'checkbox',
//             },
//             {
//               name: 'premiumContent',
//               access: {
//                 read: ({ req }) => req.user,
//               },
//               blocks: [CallToAction, Content, MediaBlock, Archive],
//               type: 'blocks',
//             },
//           ],
//           label: 'Content',
//         },
//       ],
//       type: 'tabs',
//     },
//     {
//       name: 'relatedPosts',
//       filterOptions: ({ id }) => {
//         return {
//           id: {
//             not_in: [id],
//           },
//         }
//       },
//       hasMany: true,
//       relationTo: 'posts',
//       type: 'relationship',
//     },
//     slugField(),
//   ],
//   hooks: {
//     afterChange: [revalidatePost],
//     afterRead: [populateArchiveBlock, populateAuthors],
//     beforeChange: [populatePublishedAt],
//   },
//   slug: 'posts',
//   versions: {
//     drafts: true,
//   },
// }


import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrPublished } from '../../access/adminsOrPublished'
import { Archive } from '../../blocks/ArchiveBlock'
import { CallToAction } from '../../blocks/CallToAction'
import { Content } from '../../blocks/Content'
import { MediaBlock } from '../../blocks/MediaBlock'
import { ContentMedia } from '../../blocks/ContentMedia'
import { hero } from '../../fields/hero'
import { slugField } from '../../fields/slug'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidatePost } from './hooks/revalidatePost'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    // preview: doc => {
    //   console.log(doc)
    //   return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
    //     `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/posts/${doc?.slug}`,
    //   )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    // },
    preview: async (doc) => {
      const categorySlug = doc?.categories?.[0]?.title || 'posts';
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${categorySlug}/${doc?.slug}`
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`;
    }
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidatePost],
    afterRead: [populateArchiveBlock, populateAuthors],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: adminsOrPublished,
    update: admins,
    create: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      admin: {
        readOnly: true,
        disabled: true,
      },
      access: {
        update: () => false,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: [CallToAction, Content, MediaBlock, Archive, ContentMedia],
            },
            {
              name: 'enablePremiumContent',
              label: 'Enable Premium Content',
              type: 'checkbox',
            },
            {
              name: 'premiumContent',
              type: 'blocks',
              access: {
                read: ({ req }) => req.user,
              },
              blocks: [CallToAction, Content, MediaBlock, Archive, ContentMedia],
            },
          ],
        },
      ],
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    slugField(),
  ],
}