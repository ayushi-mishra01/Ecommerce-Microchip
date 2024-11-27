'use client'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CircularProgress, Box, Typography } from '@mui/material'
import image16 from './Images/image16.png'

const CategoryPage = () => {
  const { search } = useParams()
  const [categoryIds, setCategoryIds] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [categoryHierarchy, setCategoryHierarchy] = useState([])
  const [productCountMap, setProductCountMap] = useState({})

  useEffect(() => {
    const fetchSearchResult = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/search`,
          //  `https://localhost:7053/api/Categories/search`,
          {
            Search: search
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        console.log(res)
        setSearchResult(res.data)
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    fetchSearchResult()
    document.title = 'Search Results'
  }, [])

  useEffect(() => {
    // const result = JSON.parse(localStorage.getItem('searchResult')) || [];
    // setSearchResult(result);
    const result = searchResult

    const newProductCountMap = {}
    result.forEach(item => {
      newProductCountMap[item.categoryId] = item.productCount
    })
    setProductCountMap(newProductCountMap)

    const categoryIdsList = result.map(item => item.categoryId)
    setCategoryIds(categoryIdsList)
    console.log(categoryIdsList);

    if (categoryIdsList.length > 0) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/getCategoryHierarchy`,
          // `https://localhost:7053/api/Categories/getCategoryHierarchy`,
          categoryIdsList,
        )
        .then(response => {
          console.log('API Response:', response.data)
          setCategoryHierarchy(response.data)
        })
        .catch(error => {
          console.error('Error fetching category hierarchy:', error)
        })
    }
  }, [searchResult])

  const renderSubCategories = ( subCategories, level = 1 ) => {
    return (
      <div className={styles.subcategories} style={{ marginLeft: `${level * 20}px` }}>
        {subCategories.map(subCategory => (
          <>
            <div key={subCategory.categoryId} className={styles.subcategory}>
              {/* <span className={styles.redirect}>{subCategory.name} </span> */}

              <Link
                href={
                  subCategory.subCategories.length === 0
                    ? `/categorySearch/${subCategory.slug}/${search}`
                    : `/subCategorySearch/${subCategory.slug}/${search}`
                }
                style={{ textDecoration: 'none', cursor: 'default' }}
              >
                {/* <span className={styles.redirect}>{subCategory.name} </span> */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Box
                    sx={{
                      height: '20px',
                      width: '20px',
                      marginRight: '10px',
                      marginBottom:'-2%'
                    }}
                  >
                    <img 
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/${subCategory.picture}.png`}
                      alt={subCategory.name} 
                      style={{ height: '100%', width: '100%' }}
                      onError={(e) => {
                    const target = e.target as HTMLImageElement;

                    target.onerror = null; 
                    target.src = image16.src;

                    target.addEventListener('error', () => {
                      target.src = image16.src; 
                    });
                  }}
                    /> 
                  </Box>
                    <span className={styles.redirect}>{subCategory.name}</span>
                </Box>
              </Link>

              <span className={styles.itemCount}>
                {productCountMap[subCategory.categoryId]
                  ? `${productCountMap[subCategory.categoryId]} Items`
                  : ''}
              </span>
            </div>
            {subCategory.subCategories &&
              subCategory.subCategories.length > 0 &&
              renderSubCategories( subCategory.subCategories, level + 1 )}
          </>
        ))}
      </div>
    )
  }

  const renderCategories = categories => {
    return categories.map(category => (
      <div key={category.categoryId} className={styles.categorySection}>
         <Link
          href={
            category.subCategories.length === 0
              ? `/categorySearch/${category.slug}/${search}`
              : `/subCategorySearch/${category.slug}/${search}`
          }
          style={{ textDecoration: 'none', cursor: 'default' }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            {/* Image next to category name */}
            <Box
              sx={{
                height: '30px',
                width: '30px',
                marginRight: '10px',
                marginBottom:'-2%'
              }}
            >
              <img 
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/${category.picture}.png`}
                alt={category.name} 
                style={{ height: '100%', width: '100%' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;  
                  target.onerror = null; 
                  target.src = image16.src;
                }}
              /> 
            </Box>
  
            {/* Category name */}
            <h3>
              <span className={styles.redirect}>{category.name}</span>
            </h3>
          </Box>
        </Link>
        <hr />
        {/* {category.subCategories.length > 0 && renderSubCategories(category.subCategories)} */}
        {category.level === 1 &&
        (category.subCategories.length === 0 || productCountMap[category.categoryId]) ? (
          <div className={styles.subcategory} style={{ marginLeft: '25px' }}>
            <Link
              href={
                category.subCategories.length === 0
                  ? `/categorySearch/${category.slug}/${search}`
                  : `/subCategorySearch/${category.slug}/${search}`
              }
              style={{ textDecoration: 'none', cursor: 'default' }}
            >
              <span className={styles.redirect}>{category.name} </span>
            </Link>
            <span className={styles.itemCount}>
              {productCountMap[category.categoryId]
                ? `${productCountMap[category.categoryId]} Items`
                : ''}
            </span>
          </div>
        ) : (
          category.subCategories.length > 0 && renderSubCategories(category.subCategories)
        )}
      </div>
    ))
  }

  if(categoryHierarchy.length < 0 ){
    return <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
  }
  return (
    <>
    <div className="content-container">
      {/* <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          margin: '20px 0',
          fontWeight: 'bold',
        }}
      >
        Search Results for: “{search}”
      </Typography> */}
        {/* <Box sx={{ bgcolor: '#113163', py: 3, width: '100%', marginBottom: '5px' }}> */}
        <Box
          sx={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#113163',
            padding: '10px 20px',
            height: '6rem',
            '@media (min-width:1300px)':{
              left: '50%',
              right: '50%',
              marginLeft: '-50vw',
              marginRight: '-50vw',
              width: '99.3vw',
            }
          }}
        >
          <Box
            sx={{
              maxWidth: '1350px', 
              margin: '0 auto', 
              width: '100%', 
              display: 'flex',
              flexDirection: 'column',
            }}
          >
          <Box
            sx={{
              marginLeft: '2rem',
              marginTop: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
            }}
          >
            <Typography variant="h5" sx={{ color: 'white', flexGrow: 1, fontSize: '1.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>Search Results for: </span> “{search}”
            </Typography>
          </Box>
        </Box>
        </Box>
        <div className={styles.categoryPage}>
          {renderCategories(categoryHierarchy)}
        </div>
      </div>
    </>
  )
}

export default CategoryPage
