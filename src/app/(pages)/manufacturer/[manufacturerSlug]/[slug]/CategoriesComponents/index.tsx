import React, { useState } from 'react'
import LayoutIcon from './LayoutIcon'
import GridsVertical from './GridOptionsVertical.js'
import GridsHorizontal from './GridOptionsHorizontal.js'
import CategoryHeader from './CateforyHeader.js'
import styles from './index.module.scss'

const Categories = ({ categoryId, manufacturerId, manufacturerName, categoryName }) => {
  const [isLayoutActive, setIsLayoutActive] = useState(false)

  const toggleLayout = () => {
    setIsLayoutActive(prev => !prev)
  }

  return (
    <>
      <div className="content-container">
        <CategoryHeader categoryName={categoryName} manufacturerName={manufacturerName} />
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
          <GridsHorizontal
            categoryId={categoryId}
            manufacturerId={manufacturerId}
            manufacturerName={manufacturerName}
          />
        ) : (
          <GridsVertical
            categoryId={categoryId}
            manufacturerId={manufacturerId}
            manufacturerName={manufacturerName}
          />
        )}
      </div>
    </>
  )
}

export default Categories
