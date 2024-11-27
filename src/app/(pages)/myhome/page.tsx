import React, { Fragment } from 'react'
import { Metadata } from 'next'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'

import Home from './MyComponents'


export default function Account() {
  // const { user } = await getMeUser({
  //   nullUserRedirect: `/login?error=${encodeURIComponent(
  //     'You must be logged in to access your account.',
  //   )}&redirect=${encodeURIComponent('/myhome')}`,
  // })

  return (
    <Fragment>
      <Home/>
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Home',
  description: 'Microchip Home Page.',
  openGraph: mergeOpenGraph({
    title: 'Home',
    url: '/myhome',
  }),
}
