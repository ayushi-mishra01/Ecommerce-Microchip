'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

import classes from './index.module.scss'
import { CMSLink } from '../../Link'

import { Header as HeaderType, User } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import Menu from './Menu'
import MenuBottom from './MenuBottom'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [isMyHome, setIsMyHome] = useState(false)
  const [firstPathSegment, setFirstPathSegment] = useState('')

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }

  useEffect(() => {
    setShowMenu(true)
    const currentPath = window.location.pathname

    setIsMyHome(currentPath === '/') 

    const firstSegment = currentPath.split('/').filter(Boolean)[0] || 'welcome'
    setFirstPathSegment(capitalizeFirstLetter(firstSegment))

    const handleRouteChange = () => {
      const newPath = window.location.pathname
      setIsMyHome(newPath === '/')
      
      const newFirstSegment = newPath.split('/').filter(Boolean)[0] || 'welcome'
      setFirstPathSegment(capitalizeFirstLetter(newFirstSegment))
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
    
  }, [])

  return (
    <>
      {showMenu && <Menu />}
      {/* {!isMyHome && <MenuBottom heading={firstPathSegment} />} */}
    </>
  )
}

// import React, { useState, useEffect } from 'react'
// import Link from 'next/link'

// import classes from './index.module.scss'
// import { CMSLink } from '../../Link'

// import { Header as HeaderType, User } from '../../../../payload/payload-types'
// import { useAuth } from '../../../_providers/Auth'
// import Menu from './Menu'
// import MenuBottom from './MenuBottom'

// export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
//   const navItems = header?.navItems || []
//   const { user } = useAuth()
//   const [showMenu, setShowMenu] = useState(false)
//   const [isMyHome, setIsMyHome] = useState(false)
//   const [lastPathSegment, setLastPathSegment] = useState('')

//   useEffect(() => {
//     setShowMenu(true)
//     const currentPath = window.location.pathname
//     setIsMyHome(currentPath.endsWith('/'))

//     // Extract the last segment of the path
//     const lastSegment = currentPath.split('/').filter(Boolean).pop() || 'welcome'
//     setLastPathSegment(lastSegment)

//     const handleRouteChange = () => {
//       const newPath = window.location.pathname
//       setIsMyHome(newPath.endsWith('/'))
      
//       const newLastSegment = newPath.split('/').filter(Boolean).pop() || 'welcome'
//       setLastPathSegment(newLastSegment)
//     }

//     window.addEventListener('popstate', handleRouteChange)
//     return () => {
//       window.removeEventListener('popstate', handleRouteChange)
//     }
//   }, [])

//   return (
//     <>
//       {showMenu && <Menu />}
//       {!isMyHome && <MenuBottom heading={lastPathSegment} />}
//     </>
//   )
// }


// import React, { useState, useEffect } from 'react'
// import Link from 'next/link'

// import classes from './index.module.scss'
// import { CMSLink } from '../../Link'


// import { Header as HeaderType, User } from '../../../../payload/payload-types'
// import { useAuth } from '../../../_providers/Auth'
// import Menu from './Menu'
// import MenuBottom from './MenuBottom'

// export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
//   const navItems = header?.navItems || []
//   const { user } = useAuth()
//   const [showMenu, setShowMenu] = useState(false)
//   const [isMyHome, setIsMyHome] = useState(false);

//   useEffect(() => {
//     setShowMenu(true);

//     setIsMyHome(window.location.pathname.endsWith('/'));
 
//     const handleRouteChange = () => {
//       setIsMyHome(window.location.pathname.endsWith('/'));
//     };
 
//     window.addEventListener('popstate', handleRouteChange);
//     return () => {
//       window.removeEventListener('popstate', handleRouteChange);
//     };

//   }, [])

//   return (
//     <>
//       {showMenu && <Menu />}
//       {/* <MenuBottom heading={'welcome'} />   */}
//       {!isMyHome && <MenuBottom heading={'welcome'} />}   
//     </>
//   )
// }
