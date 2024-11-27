import type { Block } from 'payload/types'
import { invertBackground } from '../../fields/invertBackground'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  fields: [
    invertBackground,
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Fullscreen',
          value: 'fullscreen',
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mediaHeight', // Field for media height
      label: 'Media Height',
      type: 'text',
      admin: {
        placeholder: 'e.g., 300px, 50%, auto',
        description: 'Specify the height of the media.',
      },
    },
    {
      name: 'mediaWidth', // Field for media width
      label: 'Media Width',
      type: 'text',
      admin: {
        placeholder: 'e.g., 100%, 50vw, 400px',
        description: 'Specify the width of the media.',
      },
    },
    {
      name: 'mediaMarginTop', // Field for media margin top
      label: 'Media Margin Top',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the top margin of the media.',
      },
    },
    {
      name: 'mediaMarginRight', // Field for media margin right
      label: 'Media Margin Right',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the right margin of the media.',
      },
    },
    {
      name: 'mediaMarginBottom', // Field for media margin bottom
      label: 'Media Margin Bottom',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the bottom margin of the media.',
      },
    },
    {
      name: 'mediaMarginLeft', // Field for media margin left
      label: 'Media Margin Left',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the left margin of the media.',
      },
    },
  ],
}
