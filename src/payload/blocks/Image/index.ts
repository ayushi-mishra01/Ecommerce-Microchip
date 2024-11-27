import type { Block } from 'payload/types';
import { invertBackground } from '../../fields/invertBackground'

export const ImageBlock: Block = {
    slug: 'image',
    fields: [
        // {
        //     name: 'image',
        //     label: 'Image',
        //     type: 'upload',
        //     relationTo: 'media',
        // }
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
    ]
}