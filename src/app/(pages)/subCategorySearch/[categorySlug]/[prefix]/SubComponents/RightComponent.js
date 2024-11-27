'use client'
import classes from './index.module.scss'
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { Typography, Paper, Grid } from '@mui/material'
import axios from 'axios'
import image16 from './assets/image16.png'
import Link from 'next/link'

const RightComponent = ({ categoryId, prefix }) => {
  const [subCat, setSubCat] = useState([])
  const [subCatNotImmediate, setSubCatNotImmediate] = useState([])

  useEffect(() => {
    fetchCategoriesWithProductCount()
    fecthSubCategoryWithProductParentCategory()
  }, [])

  const fetchCategoriesWithProductCount = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/getProductCountByParentCategory`,
        //`https://localhost:7053/api/Categories/getProductCountByParentCategory`,
        null,
        {
          params: {
            categoryId: categoryId,
            prefix: prefix || '',
          },
        },
      )
      const sortedCategories = response.data.sort((a, b) => a.name.localeCompare(b.name))
      setSubCat(sortedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fecthSubCategoryWithProductParentCategory = async () => {
    try {
      const response = await axios.post(
      `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/getSubCategoryWithProductParentCategory`,
        //`https://localhost:7053/api/Categories/getSubCategoryWithProductParentCategory`,
        null,
        {
          params: {
            categoryId: categoryId,
            prefix: prefix || '',
          },
        },
      )

      const sortedCategories = response.data.sort((a, b) => a.name.localeCompare(b.name))
      setSubCatNotImmediate(sortedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        {subCat.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              key={category.categoryId}
              className={classes.productc}
              elevation={3}
              sx={{
                textAlign: 'center',
                margin: '10px',
                height: 'auto',
                minHeight: '280px',
                transition: 'transform 0.3s, box-shadow ease 0.3s', 
                '&:hover': {
                  transform: 'scale(1.0)',
                  boxShadow: '0 5px 9px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              {/* <img src={image16.src} alt={category.name} style={{ width: '100px' }} /> */}
              <img 
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/${category.picture}.png`}
              alt={category.name} 
              style={
                { 
                  width: '100px',
                  border:'2px solid #122050',
                  borderRadius: '8px',   
                  padding: '5px'
                }
              } 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = image16.src;
              }}
            />
              <Typography variant="h7" fontWeight="bold" component="p">
                {category.name}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#999' }}>
                {category.productCount} Items
              </Typography>
              <Link href={`/categorySearch/${category.slug}/${prefix}`}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f5d949',
                    color: 'black',
                    width: '120px',
                    fontSize: '10px',
                    marginTop: '5px',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#113163',
                      color: 'white',
                    },
                  }}
                >
                  PRODUCTS
                </Button>
              </Link>
            </Paper>
          </Grid>
        ))}

        {subCatNotImmediate.length > 0 &&
          subCatNotImmediate.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper
                key={category.categoryId}
                className={classes.productc}
                elevation={3}
                sx={{
                  textAlign: 'center',
                  margin: '10px',
                  height: 'auto',
                  minHeight: '280px',
                  transition: 'transform 0.3s, box-shadow ease 0.3s', 
                  '&:hover': {
                    transform: 'scale(1.0)',
                    boxShadow: '0 5px 9px rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                {/* <img src={image17.src} alt={category.name} style={{ width: '100px' }} /> */}
                <img 
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/${category.picture}.png`}
                  alt={category.name} 
                  style={
                    { 
                      width: '100px',
                      border:'2px solid #122050',
                      borderRadius: '8px',   
                      padding: '5px'
                    }
                  } 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = image16.src;
                  }}
                />

                <Typography variant="h7" fontWeight="bold" component="p">
                  {category.name}
                </Typography>

                <Link href={`/subCategorySearch/${category.slug}/${prefix}`}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#f5d949',
                      color: 'black',
                      width: '120px',
                      fontSize: '10px',
                      marginTop: '5px',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#113163',
                        color: 'white',
                      },
                    }}
                  >
                    SUBCATEGORIES
                  </Button>
                </Link>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </>
  )
}

export default RightComponent
