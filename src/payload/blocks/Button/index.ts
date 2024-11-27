import type { Block } from 'payload/types'

export const ButtonBlock: Block = {
  slug: 'buttonBlock',
  fields: [
    {
      name: 'buttonLabel',
      label: 'Button Label',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Enter the button text',
        description: 'Text to display inside the button.',
      },
    },
    {
      name: 'buttonHeight', 
      label: 'Button Height',
      type: 'text',
      admin: {
        placeholder: 'e.g., 50px, auto',
        description: 'Specify the height of the button.',
      },
    },
    {
      name: 'buttonWidth', 
      label: 'Button Width',
      type: 'text',
      admin: {
        placeholder: 'e.g., 200px, 50%',
        description: 'Specify the width of the button.',
      },
    },
    {
      name: 'buttonBackgroundColor',
      label: 'Button Background Color',
      type: 'text',
      admin: {
        placeholder: 'e.g., #0000ff, rgba(0, 0, 255, 0.8)',
        description: 'Specify the background color of the button.',
      },
    },
    {
      name: 'buttonTextColor',
      label: 'Button Text Color',
      type: 'text',
      admin: {
        placeholder: 'e.g., #ffffff',
        description: 'Specify the text color of the button.',
      },
    },
    {
      name: 'borderTop',
      label: 'Border Top',
      type: 'text',
      admin: {
        placeholder: 'e.g., 2px solid #000',
        description: 'Specify the top border of the button.',
      },
    },
    {
      name: 'borderRight',
      label: 'Border Right',
      type: 'text',
      admin: {
        placeholder: 'e.g., 2px solid #000',
        description: 'Specify the right border of the button.',
      },
    },
    {
      name: 'borderBottom',
      label: 'Border Bottom',
      type: 'text',
      admin: {
        placeholder: 'e.g., 2px solid #000',
        description: 'Specify the bottom border of the button.',
      },
    },
    {
      name: 'borderLeft',
      label: 'Border Left',
      type: 'text',
      admin: {
        placeholder: 'e.g., 2px solid #000',
        description: 'Specify the left border of the button.',
      },
    },
    {
      name: 'buttonMarginTop', 
      label: 'Button Margin Top',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the top margin of the button.',
      },
    },
    {
      name: 'buttonMarginRight', 
      label: 'Button Margin Right',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the right margin of the button.',
      },
    },
    {
      name: 'buttonMarginBottom', 
      label: 'Button Margin Bottom',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the bottom margin of the button.',
      },
    },
    {
      name: 'buttonMarginLeft', 
      label: 'Button Margin Left',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 2rem',
        description: 'Specify the left margin of the button.',
      },
    },
    {
      name: 'buttonPadding',
      label: 'Button Padding',
      type: 'text',
      admin: {
        placeholder: 'e.g., 10px, 1rem',
        description: 'Specify the padding inside the button.',
      },
    },
    {
        name: 'borderRadius', 
        label: 'Border Radius',
        type: 'text',
        admin: {
          placeholder: 'e.g., 5px, 50%',
          description: 'Specify the border radius of the button for rounded corners.',
        },
    },
    {
      name: 'fontSize',
      label: 'Font Size',
      type: 'text',
      admin: {
        placeholder: 'e.g., 16px, 1.5rem',
        description: 'Specify the font size of the button text.',
      },
    },
    {
      name: 'buttonLink',
      label: 'Button Link',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g., /contact, https://example.com',
        description: 'URL or page path to navigate to when the button is clicked.',
      },
    },
    {
      name: 'openInNewTab',
      label: 'Open in New Tab',
      type: 'checkbox',
      admin: {
        description: 'Whether to open the link in a new tab.',
      },
    },
  ],
}

