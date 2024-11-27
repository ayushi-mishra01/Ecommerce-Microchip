'use client'
import React, { Fragment } from 'react'
import Shop from './ShopComponents'
import { Metadata } from 'next'
import { useParams } from 'next/navigation';

export default function Account() {
  const { categoryId } = useParams();
  return (
    <Fragment>
        <Shop categoryId={Number(categoryId)}/>
    </Fragment>
  )
}

// export const metadata: Metadata = {
//   title: 'Shop',
//   description: 'Microchip Shop Page.',
//   openGraph: mergeOpenGraph({
//     title: 'shop',
//     url: '/shop',
//   }),
// }


