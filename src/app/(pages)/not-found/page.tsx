'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import styles from './index.module.scss'

const Custom404 = () => {
  useEffect(() => {
    document.title = 'Not found'
  }, [])
  return (
    <div className="content-container">
      <div className={styles.container}>
        <h3>Product Not Found</h3>
        <p>Sorry, the search did not return any results. Please try different keywords.</p>
        <Link href="/" className={styles.link}>
          Go back to Home
        </Link>
      </div>
    </div>
  )
}

export default Custom404
