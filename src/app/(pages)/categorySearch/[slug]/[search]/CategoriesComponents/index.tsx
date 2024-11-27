import React, { useState } from 'react'
import LayoutIcon from './LayoutIcon'
import GridsHorizontal from './GridOptionsHorizontal'
import GridsVertical from './GridOptionsVertical'
import CategoryHeader from './CategoryHeader'
import styles from './index.module.scss'

const Categories = ({ categoryId, search, categoryName }) => {
  const [isLayoutActive, setIsLayoutActive] = useState(false)

  const toggleLayout = () => {
    setIsLayoutActive(prev => !prev)
  }

  return (
    <>
      {/* <div style={{ backgroundColor: '#F5F5F5' }}> */}
      <div>
        <CategoryHeader categoryName={categoryName} />
        {/* <Grids categoryId={categoryId} search={search} categoryName={categoryName} /> */}
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
          <GridsHorizontal categoryId={categoryId} search={search} categoryName={categoryName} />
        ) : (
          <GridsVertical categoryId={categoryId} search={search} categoryName={categoryName} />
        )}
      </div>
      {/* </div> */}
    </>
  )
}

export default Categories
