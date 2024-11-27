import React, { Fragment } from 'react'
import { Metadata } from 'next'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph';
import ProductsPage from './ProductPage';

export default function Account() {
  return (
    <Fragment>
      <div className="content-container">
        <ProductsPage />
      </div>
    </Fragment>
  )
}
export const metadata: Metadata = {
  title: 'Products',
  description: 'Microchip Products Page.',
  openGraph: mergeOpenGraph({
    title: 'Products',
    url: '/products',
  }),
}


