import { Box, Typography, Grid, Paper, Link, Button, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import classes from './index.module.scss'
import image16 from './assets/image16.png'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-x: auto;
`

const Main = ({ manufacturerIds }) => {
  const [manufacturersData, setManufacturersData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchManufacturersData = async () => {
    const idsToFetch = Object.values(manufacturerIds).filter(Boolean)

    if (idsToFetch.length === 0) {
      setError('No manufacturer IDs provided')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const dataPromises = idsToFetch.map(async id => {
        const [manufacturerResponse, categoriesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/${id}`),
          axios.get(
            `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/getCategoriesByManufacturer/${id}`,
          ),
        ])
        return {
          manufacturer: manufacturerResponse.data,
          categories: categoriesResponse.data,
        }
      })

      const manufacturersDataInner = await Promise.all(dataPromises)
      setManufacturersData(manufacturersDataInner)
      console.log('manufacturersData: ', manufacturersData)
      const categoryMap = {}
      manufacturersDataInner.forEach(({ manufacturer, categories }) => {
        categories.forEach(category => {
          if (!categoryMap[category.categoryId]) {
            categoryMap[category.categoryId] = {
              ...category,
              manufacturers: [manufacturer.slug],
            }
          } else {
            categoryMap[category.categoryId].manufacturers.push(manufacturer.slug)
          }
        })
      })

      // const combinedCategories = Object.values(categoryMap)
      const combinedCategories = Object.values(categoryMap).sort((a, b) =>
        a.name.localeCompare(b.name),
      )

      setCategoryData(combinedCategories)
      console.log('combinedCategories: ', combinedCategories)
      setError(null)
    } catch (error) {
      console.error('Error fetching manufacturer data:', error)
      setError('Error fetching manufacturer data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManufacturersData()
  }, [manufacturerIds])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) return <p>{error}</p>

  return (
    <>
      <Box
        sx={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: '#113163',
          padding: '10px 20px',
          height: '6rem',
          '@media (min-width: 1300px)': {
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            width: '99.3vw',
          },
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
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                flexGrow: 1,
                fontSize: '1.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1,
                maxWidth: '100%',
              }}
            >
              {manufacturersData[0].manufacturer.name} / {manufacturersData[1].manufacturer.name}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center',
                flexGrow: 1,
                marginTop: { xs: '0.5rem', md: '0' },
                minWidth: '0',
              }}
            >
              <Link href="/" sx={{ textDecoration: 'none' }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#d1d5db',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  Home
                </Typography>
              </Link>
              <Typography
                variant="body1"
                sx={{
                  color: '#d1d5db',
                  mx: 0.2,
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ArrowRightIcon fontSize="small" />
              </Typography>
              <Link href="/manufacturers" sx={{ textDecoration: 'none' }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#d1d5db',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  Manufacturers
                </Typography>
              </Link>
              <Typography
                variant="body1"
                sx={{
                  color: '#d1d5db',
                  mx: 0.2,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ArrowRightIcon fontSize="small" />
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                  maxWidth: '100%',
                  minWidth: '0',
                }}
              >
                {manufacturersData[0].manufacturer.name} / {manufacturersData[1].manufacturer.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Container>
        <MainContent>
          <Typography variant="h4" align="center" mb={3} mt={3}>
            Product Categories
          </Typography>
          <Grid container spacing={2}>
            {categoryData.map(category => {
              // Combine slugs for manufacturers associated with this category
              const combinedSlug =
                category.manufacturers.length > 1
                  ? 'manufacturers/' + category.manufacturers.join('/')
                  : 'manufacturer/' + category.manufacturers[0]

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category.categoryId}>
                  <Paper
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
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/${category.picture}.png`}
                      alt={category.name}
                      style={{
                        width: '100px',
                        border: '2px solid #122050',
                        borderRadius: '8px',
                        padding: '5px',
                      }}
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = image16.src
                      }}
                    />
                    <Typography variant="h7" fontWeight="bold" component="p" mt={2} mb={2}>
                      {category.name}
                    </Typography>
                    <Link
                      href={`/${combinedSlug}/${category.slug}`}
                      sx={{ textDecoration: 'none' }}
                    >
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
              )
            })}
          </Grid>
        </MainContent>
      </Container>
    </>
  )
}

export default Main
