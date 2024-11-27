import type { Block } from 'payload/types'
import { invertBackground } from '../../fields/invertBackground'
import richText from '../../fields/richText'

export const ContentMedia: Block = {
  slug: 'contentMedia',
  fields: [
    invertBackground,
    {
      name: 'mediaPosition',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
        {
          label: 'Top',
          value: 'top',
        },
        {
          label: 'Bottom',
          value: 'bottom',
        },
      ],
      type: 'radio',
    },
    richText(),
    {
      name: 'media',
      relationTo: 'media',
      required: true,
      type: 'upload',
    },
    {
      name: 'mediaHeight', 
      label: 'Media Height',
      type: 'text',
      admin: {
        placeholder: 'e.g., 300px, 50%, auto',
        description: 'Specify the height of the media.',
      },
    },
    {
      name: 'mediaWidth',
      label: 'Media Width',
      type: 'text',
      admin: {
        placeholder: 'e.g., 100%, 50vw, 400px',
        description: 'Specify the width of the media.',
      },
    },
    {
      name: 'mediaMarginTop', 
      label: 'Media Margin Top',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the top margin of the media.',
      },
    },
    {
      name: 'mediaMarginRight', 
      label: 'Media Margin Right',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the right margin of the media.',
      },
    },
    {
      name: 'mediaMarginBottom', 
      label: 'Media Margin Bottom',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the bottom margin of the media.',
      },
    },
    {
      name: 'mediaMarginLeft', 
      label: 'Media Margin Left',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the left margin of the media.',
      },
    },
    {
      name: 'contentWidth', 
      label: 'Content Width',
      type: 'text',
      admin: {
        placeholder: 'e.g., 100%, 50vw, 400px',
        description: 'Specify the width of the content.',
      },
    },
    {
      name: 'contentHeight', 
      label: 'Content Height',
      type: 'text',
      admin: {
        placeholder: 'e.g., auto, 300px, 50%',
        description: 'Specify the height of the content.',
      },
    },
    {
      name: 'contentMarginTop', 
      label: 'Content Margin Top',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the top margin of the content.',
      },
    },
    {
      name: 'contentMarginRight', 
      label: 'Content Margin Right',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the right margin of the content.',
      },
    },
    {
      name: 'contentMarginBottom', 
      label: 'Content Margin Bottom',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the bottom margin of the content.',
      },
    },
    {
      name: 'contentMarginLeft', 
      label: 'Content Margin Left',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the left margin of the content.',
      },
    },
    {
      name: 'contentPadding', 
      label: 'Content Padding',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the left margin of the content.',
      },
    },
    {
      name: 'backgroundColor',
      label: 'Background Color',
      type: 'text', 
      admin: {
        placeholder: 'e.g., #ffffff or rgba(255, 255, 255, 0.8)',
        description: 'Specify the background color for the content block.',
      },
    },
    {
      name: 'color',
      label: 'Text Color',
      type: 'text',
      admin: {
        placeholder: 'e.g., #000000 or rgba(0, 0, 0, 0.8)',
        description: 'Specify the text color for the content block.',
      },
    },
    {
      name: 'fontSize',
      label: 'Font Size',
      type: 'text',
      admin: {
        placeholder: 'e.g., 16px or 1.5em',
        description: 'Specify the font size for the text in the content block.',
      },
    },
  ],
}
