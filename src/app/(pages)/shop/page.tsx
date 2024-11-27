import React, { Fragment } from 'react'
import Shop from './ShopComponents'
import { Metadata } from 'next'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'

export default function Account() {
  return (
    <Fragment>
        <Shop/>
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Microchip Shop Page.',
  openGraph: mergeOpenGraph({
    title: 'shop',
    url: '/shop',
  }),
}