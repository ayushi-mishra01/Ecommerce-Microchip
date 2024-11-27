'use client'
import classes from './index.module.scss'
import  { useState, useEffect } from 'react'
import * as React from 'react'
import Button from '@mui/material/Button'
import { Typography,Paper,Grid } from '@mui/material'
import axios from 'axios'
import image16 from './assets/image16.png'
import Link from 'next/link';

const RightComponent = ({ categoryId }) => {
  const [subCat, setSubCat] = useState([]);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories`);
      setCategory(response.data);
      const filteredCategories = response.data.filter(category => category.parentCategoryId === categoryId );
      const sortedCategories = filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
      setSubCat(sortedCategories);
      console.log(sortedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const hasSubCategories = (cat) => {
    return category.some(subcategory => subcategory.parentCategoryId === cat.categoryId);
  };

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
                e.target.src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/${picture}.png`;
              }}
            />
            <Typography variant="h7" fontWeight="bold" component="p" mt={2} mb={2}>
              {category.name}
            </Typography>
            {/* <Link href={`/categories/${category.categoryId}`}> */}
            <Link href={hasSubCategories(category)
                ? `/subCategories/${category.slug}` 
                : `/category/${category.slug}`   
              }
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
                        }
                }}
              >
                {hasSubCategories(category)?"SUBCATEGORIES":'PRODUCTS'}
              </Button>
            </Link>
          </Paper>
          </Grid>
        ))}
      </Grid>
      {/* <Box style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {subCat.map((category, index) => (
          <Paper
            key={category.categoryId}
            className={classes.productc}
            elevation={3}
            style={{ textAlign: 'center', margin: '10px' }}
          >
            <img src={image17.src} alt={category.name} style={{ width: "100px" }} />
            <Typography variant="h7" fontWeight="bold" component="p" mt={2} mb={2}>
              {category.name}
            </Typography>
            <Link href={`/categories/${category.categoryId}`}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#f5d949',
                  color: 'black',
                  width: '120px',
                  fontSize: '10px',
                  marginTop: '5px',
                  fontWeight: 'bold',
                }}
                className={classes.button}
              >
                PRODUCTS
              </Button>
            </Link>
          </Paper>
        ))}
      </Box> */}

      {/* <Box style={{ marginTop: "20px", display: "flex", justifyContent: "center", marginTop: "4%", padding: isMobile ? "0 10px" : "0" }}>
        <Pagination
          count={totalPages}
          page={pageNumber}
          onChange={handlePageChange}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              sx={{
                fontWeight: item.page === pageNumber ? "bold" : "normal",
                fontSize: isMobile ? "0.75rem" : "1rem",
                margin: isMobile ? "0 2px" : "0 4px",
                padding: isMobile ? "2px 4px" : "4px 8px",
              }}
            />
          )}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 0 : 1}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
        />
      </Box> */}
    </>
  );
};
export default RightComponent

