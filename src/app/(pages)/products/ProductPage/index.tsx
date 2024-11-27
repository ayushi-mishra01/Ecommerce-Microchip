'use client';
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import styles from './index.module.scss';
import ColumnLayout from '../../myhome/MyComponents/ColumnLayout';
import Link from 'next/link';
import { Box, Grid, Typography, Button, Paper } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

const initialBoxData = [];
const categories = [
  { name: 'Embedded', logo: `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/Integrated-Circuits-ICs.png`, slug: 'embedded' },
  { name: 'CPLDs (Complex Programmable Logic Devices)', logo: `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/CPLDs-Complex-Programmable-Logic-Devices.png`, slug: 'cplds-complex-programmable-logic-devices' },
  { name: 'Microcontrollers, Microprocessor, FPGA Modules', logo: `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/Microcontrollers-Microprocessor-FPGA-Modules.png`, slug: 'microcontrollers-microprocessor-fpga-modules' },
  { name: 'System On Chip (SoC)', logo: `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/System-On-Chip-SoC.png`, slug: 'system-on-chip-soc' },
  { name: 'FPGAs (Field Programmable Gate Array) with Microcontrollers', logo: `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/FPGAs-Field-Programmable-Gate-Array-with-Microcontrollers.png`, slug: 'fpgas-field-programmable-gate-array-with-microcontrollers' },
  { name: 'PLDs (Programmable Logic Device)', logo: `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/PLDs-Programmable-Logic-Device .png`, slug: 'plds-programmable-logic-device' }
];
const ProductsPage = () => {
    const [boxesData, setBoxData] = useState(initialBoxData);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        try {
          //setLoading(true)
          fetchCategories();
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
    }, []);

    const fetchCategories = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories`
            // `https://localhost:7053/api/Categories`
          );
          const categories = response.data;
          const categoryMap = new Map(categories.map((cat: { categoryId: any; }) => [cat.categoryId, cat]));
          const transformedData = categories
          .filter((category: { parentCategoryId: null; }) => category.parentCategoryId === null)
          .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
          .map((parentCategory: { categoryId: any; name: any; picture:any, slug: string }) => {
            const childCategories = categories
              .filter((cat: { parentCategoryId: any;}) => cat.parentCategoryId === parentCategory.categoryId)
              .map((cat: { name: any; categoryId: any; slug: string }) => {
                // Check if the current child category has subcategories
                const grandchildCategories = categories
                  .filter((subCat: { parentCategoryId: any; }) => subCat.parentCategoryId === cat.categoryId);
                
                return {
                  name: cat.name,
                  slug: cat.slug,
                  hasSubcategories: grandchildCategories.length > 0
                };
              })
              .sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
    
              return {
                title: parentCategory.name,
                image:`${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/${parentCategory.picture}.png`,
                slug: parentCategory.slug,
                items: childCategories,
                is: childCategories.length != 0 ? true: true
              };
            });
          setBoxData(transformedData);
          console.log("box data:", transformedData);
        } catch (error) {
          console.error('Error fetching categories:', error);
          if (error.response) {
            console.error('Response error:', error.response);
          } else if (error.request) {
            console.error('Request error:', error.request);
          } else {
            console.error('Other error:', error.message);
          }
        }
    };

    if (loading) return <Box
        sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    }}
    >
      <CircularProgress />
    </Box>
    if (error) return <p>{error}</p>


    console.log("in products page")
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
            '@media (min-width: 1300px)':{
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
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', flexGrow: 1, fontSize: '1.8rem' }}>
           Products
          </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '20rem', 
              // justifyContent: 'flex-end'
              }}>
              <Link href="/">
                <Button
                  variant="text"
                  sx={{
                    textTransform: 'none',
                    color: '#d1d5db', 
                    fontSize: '0.75rem',
                    mr: '-15px',
                    // mb: '2px',
                    '&:hover': {
                      color: 'white', 
                    },
                  }}
                >
                  Home
                </Button>
              </Link>
              <Typography variant="body1" sx={{ color: '#d1d5db', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <ArrowRightIcon fontSize="small" />
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  // whiteSpace: 'nowrap',
                  // overflow: 'hidden',
                  // textOverflow: 'ellipsis',
                  // mt: '3px', 
                  fontSize: '0.75rem',
                  p: 0,
                  // '&:hover': {
                  //   color: 'white', 
                  // },
                }}
              >
                Products
              </Typography>
            </Box>
        </Box>
      </Box>
      </Box>
        <Box display="flex" justifyContent="center" alignItems="center" mb={4} sx={{marginTop:"2%"}}>
          <Typography variant="h4" component="h1" gutterBottom>
            Popular Categories
          </Typography>
        </Box>

        <Grid container spacing={1} mb={4} sx={{ paddingLeft: '20px', paddingRight: '20px' }}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Paper
                key={category.slug}
                elevation={3}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  margin: '10px',
                  height: 'auto',
                  minHeight: '280px',
                  padding: '16px',
                  transition: 'transform 0.3s, box-shadow ease 0.3s',
                  '&:hover': {
                    transform: 'scale(1.0)',
                    boxShadow: '0 5px 9px rgba(0, 0, 0, 0.4)',
                  },
                }}
              >
                <Link
                  href={
                    category.name === 'Embedded'
                      ? `/subCategories/${category.slug}`
                      : `/products/category/${category.slug}`
                  }
                  passHref
                >
                  <Box
                    component="img"
                    src={category.logo || `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/default.png`}
                    alt={category.name}
                    sx={{
                      width: '100px',
                      height: '100px',
                      border: '2px solid #122050',
                      borderRadius: '8px',
                      padding: '5px',
                      objectFit: 'contain',
                      marginTop: '10px',
                      marginBottom: '16px',
                    }}
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/default.png`;
                    // }}
                  />
                </Link>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  component="p"
                  mt={2}
                  mb={2}
                  sx={{ textAlign: 'center' }}
                >
                  {category.name}
                </Typography>
                <Link
                  href={
                    category.name === 'Embedded'
                      ? `/subCategories/${category.slug}`
                      : `/products/category/${category.slug}`
                  }
                  passHref
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
                    {category.name === 'Embedded' ? 'SUBCATEGORIES' : 'PRODUCTS'}
                  </Button>
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* <Grid container spacing={1} mb={4} sx={{ paddingLeft: "4px", paddingRight: "4px" }}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Link href={category.name === 'Embedded' ? `/subCategories/${category.slug}` : `/products/category/${category.slug}`} passHref>
                <Box
                  textAlign="center"
                  p={2}
                  border={1}
                  borderColor="#ddd"
                  borderRadius={4}
                  sx={{
                    height: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.0)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={category.logo}
                    alt={category.name}
                    sx={{
                      width: '70%',
                      height: '100px',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />

                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                      variant="body1"
                      sx={{
                        marginTop: '6px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid> */}

      <ColumnLayout boxesData={boxesData} />
    </>
    )
}

export default ProductsPage
