import React, { Fragment } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { ContentBlock } from '../../../_blocks/Content'
import { Gutter } from '../../../_components/Gutter'
import { VerticalPadding } from '../../../_components/VerticalPadding'
import { mergeOpenGraph } from '../../../_utilities/mergeOpenGraph'

export default async function ContentBlockPage() {
  return (
    <Fragment>
      <Gutter>
        <p>
          <Link href="/styleguide">Styleguide</Link>
          {' / '}
          <span>Content Block</span>
        </p>
        <h1>Content Block</h1>
      </Gutter>
      <VerticalPadding bottom="large" top="none">
        {/* <ContentBlock
        {/* <ContentBlock
          blockType="content"
          columns={[
            {
              size: 'full',
              richText: [
                {
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
              ],
            },
          ]}
        /> */}
        <ContentBlock
          blockType="content"
          columns={[
            {
              invertBackground: false,
              size: 'full', 
              richText: [
                {
                  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
              ], 
              enableLink: false, 
              link: null, 
              contentMedia: [], 
              columnWidth: '100%',
              columnHeight: 'auto',
              borderTop: 'none', 
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: 'none',
              padding: 'none',
              marginLeft: 'none',
            },
          ]}
        />
      </VerticalPadding>
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Content Block',
  description: 'Styleguide for the Content Block',
  openGraph: mergeOpenGraph({
    title: 'Content Block',
    url: '/styleguide/content-block',
  }),
}
