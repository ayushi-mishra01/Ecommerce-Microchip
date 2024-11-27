import type { Block, Field } from 'payload/types'

import { invertBackground } from '../../fields/invertBackground'
import link from '../../fields/link'
import richText from '../../fields/richText'
import { ContentMedia } from '../ContentMedia'
import { FormBlock } from '../Form'
import { Carousel } from '../Carousel'
import { ButtonBlock } from '../Button'

const columnFields: Field[] = [
  invertBackground,
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        value: 'oneThird',
        label: 'One Third',
      },
      {
        value: 'half',
        label: 'Half',
      },
      {
        value: 'twoThirds',
        label: 'Two Thirds',
      },
      {
        value: 'full',
        label: 'Full',
      },
    ],
  },
  richText(),
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
      },
    },
  }),
  {
    name: 'contentMedia',
    label: 'Add blocks',
    type: 'blocks',
    blocks: [
      ContentMedia, 
      FormBlock,
      Carousel,
      ButtonBlock,
    ],
  },
  {
    name: 'columnWidth',
    label: 'Column Width',
    type: 'text',
    admin: {
      placeholder: 'e.g., 100px or 50%',
    },
  },
  {
    name: 'columnHeight',
    label: 'Column Height',
    type: 'text',
    admin: {
      placeholder: 'e.g., 100px or 50%',
    },
  },
  {
    name: 'borderTop',
    label: 'Border Top',
    type: 'text',
    admin: {
      placeholder: 'e.g., 1px solid black',
      description: 'Specify the top border style.',
    },
  },
  {
    name: 'borderRight',
    label: 'Border Right',
    type: 'text',
    admin: {
      placeholder: 'e.g., 1px solid black',
      description: 'Specify the right border style.',
    },
  },
  {
    name: 'borderBottom',
    label: 'Border Bottom',
    type: 'text',
    admin: {
      placeholder: 'e.g., 1px solid black',
      description: 'Specify the bottom border style.',
    },
  },
  {
    name: 'borderLeft',
    label: 'Border Left',
    type: 'text',
    admin: {
      placeholder: 'e.g., 1px solid black',
      description: 'Specify the left border style.',
    },
  },
  {
    name: 'padding',
    label: 'Padding',
    type: 'text',
    admin: {
      placeholder: 'e.g., 10px or 2%',
    },
  },
  {
    name: 'marginLeft',
    label: 'Margin Left',
    type: 'text',
    admin: {
      placeholder: 'e.g., 10px or 2%',
    },
  },
];


export const Content: Block = {
  slug: 'content',
  fields: [
    invertBackground,
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
    {
      name: 'contentHeight',
      label: 'Block Height',
      type: 'text', 
      admin: {
        placeholder: 'e.g., 100px or 50%',
      },
    },
    {
      name: 'contentWidth',
      label: 'Block Width',
      type: 'text', 
      admin: {
        placeholder: 'e.g., 100px or 50%',
      },
    },
    {
      name: 'contentPaddingTop',
      label: 'Block Padding Top',
      type: 'text', 
      admin: {
        placeholder: 'e.g., 100px or 50%',
      },
    },
    {
      name: 'contentMarginBottom',
      label: 'Block Margin Bottom',
      type: 'text', 
      admin: {
        placeholder: 'e.g., 100px or 50%',
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
