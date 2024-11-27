import React, { useState } from 'react'
import LayoutIcon from './LayoutIcon'
import GridsVertical from './GridOptionsVertical.js'
import GridsHorizontal from './GridOptionsHorizontal.js'
import CategoryHeader from './CateforyHeader.js'
import styles from './index.module.scss'

const Categories = ({
  categoryId,
  manufacturerId1,
  manufacturerName1,
  manufacturerId2,
  manufacturerName2,
  categoryName,
}) => {
  const [isLayoutActive, setIsLayoutActive] = useState(false)

  const toggleLayout = () => {
    setIsLayoutActive(prev => !prev)
  }

  return (
    <>
      <div className="content-container">
        <CategoryHeader
          categoryName={categoryName}
          manufacturerName1={manufacturerName1}
          manufacturerName2={manufacturerName2}
        />
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
            manufacturerId1={manufacturerId1}
            manufacturerId2={manufacturerId2}
          />
        ) : (
          <GridsVertical
            categoryId={categoryId}
            manufacturerId1={manufacturerId1}
            manufacturerId2={manufacturerId2}
          />
        )}
      </div>
    </>
  )
}

export default Categories
