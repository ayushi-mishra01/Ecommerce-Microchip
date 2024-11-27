import type { Block } from 'payload/types';
import { invertBackground } from '../../fields/invertBackground';
import richText from '../../fields/richText';

export const Carousel: Block = {
  slug: 'carousel',
  fields: [
    invertBackground,
    {
      name: 'cardsPerPage',
      label: 'Cards Per Page',
      type: 'number',
      admin: {
        placeholder: 'e.g., 1, 2, 3',
        description: 'Specify the number of cards to display per page.',
      },
      required: true,
    },
    {
      name: 'slidesToScroll',
      label: 'Slides to Scroll',
      type: 'number',
      admin: {
        placeholder: 'e.g., 1, 2, 3',
        description: 'Specify the number of slides to scroll per click.',
      },
      required: true,
    },
    {
      name: 'autoPlay',
      label: 'Auto Play',
      type: 'checkbox',
      admin: {
        description: 'Enable autoplay for the carousel.',
      },
    },
    {
      name: 'autoPlaySpeed',
      label: 'Auto Play Speed',
      type: 'number',
      admin: {
        placeholder: 'e.g., 3000 (for 3 seconds)',
        description: 'Specify the autoplay speed in milliseconds.',
        condition: (_, siblingData) => siblingData.autoPlay,
      },
    },
    {
      name: 'loop',
      label: 'Loop Slides',
      type: 'checkbox',
      admin: {
        description: 'Enable looping for the carousel.',
      },
    },
    {
      name: 'cards',
      label: 'Cards',
      type: 'array',
      fields: [
        {
          name: 'media',
          relationTo: 'media',
          required: false,
          type: 'upload',
        },
        richText(),
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
          name: 'mediaMargin',
          label: 'Media Margin',
          type: 'text',
          admin: {
            placeholder: 'e.g., 10px, 2rem',
            description: 'Specify the margin of the media.',
          },
        },
        // {
        //   name: 'mediaMarginRight',
        //   label: 'Media Margin Right',
        //   type: 'text',
        //   admin: {
        //     placeholder: 'e.g., 10px, 2rem',
        //     description: 'Specify the margin of the media.',
        //   },
        // },
        // {
        //   name: 'mediaMarginBottom',
        //   label: 'Media Margin Bottom',
        //   type: 'text',
        //   admin: {
        //     placeholder: 'e.g., 10px, 2rem',
        //     description: 'Specify the margin of the media.',
        //   },
        // },
        // {
        //   name: 'mediaMarginLeft',
        //   label: 'Media Margin Left',
        //   type: 'text',
        //   admin: {
        //     placeholder: 'e.g., 10px, 2rem',
        //     description: 'Specify the margin of the media.',
        //   },
        // },
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
          name: 'contentWidth',
          label: 'Content Width',
          type: 'text',
          admin: {
            placeholder: 'e.g., 100%, 50vw, 400px',
            description: 'Specify the width of the content.',
          },
        },
        {
          name: 'contentMargin',
          label: 'Content Margin',
          type: 'text',
          admin: {
            placeholder: 'e.g., 10px, 2rem',
            description: 'Specify the margin of the content.',
          },
        },
      ],
    },
  ],
};
