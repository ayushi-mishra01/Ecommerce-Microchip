import React, { useState } from 'react'
import LayoutIcon from './LayoutIcon'
import GridsHorizontal from './GridOptionsHorizontal'
import GridsVertical from './GridOptionsVertical'
import CategoryHeader from './CategoryHeader'
import styles from './index.module.scss'

const Categories = ({ categoryId, path, categoryName }) => {
  const [isLayoutActive, setIsLayoutActive] = useState(false)

  const toggleLayout = () => {
    setIsLayoutActive(prev => !prev)
  }

  return (
    <>
      {/* <div style={{ backgroundColor: '#F5F5F5' }}> */}

      <div className="content-container">
        <CategoryHeader categoryName={categoryName} path={path} />
        {/* <GridsVertical categoryId={categoryId} path={path} categoryName={categoryName}/> */}
        <div className={styles.headingProductContainer}>
          <div className={styles.headingProduct}>
            <div className="headerFont">
              Available {categoryName.replace(/Products/, '').trim()} Products
              <button
                id="toggle-layout-button"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  verticalAlign: 'middle',
                  marginTop: '-4px',
                  cursor: 'pointer'
                }}
                onClick={toggleLayout}
              >
                <LayoutIcon />
              </button>
            </div>
          </div>
        </div>
        {isLayoutActive ? (
          <GridsHorizontal categoryId={categoryId} path={path} categoryName={categoryName} />
        ) : (
          <GridsVertical categoryId={categoryId} path={path} categoryName={categoryName} />
        )}
      </div>
    </>
  )
}

export default Categories
