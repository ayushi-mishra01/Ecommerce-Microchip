'use client'
import React, { Fragment, useState, useEffect } from 'react'
import SubCategory from './SubComponents'
import { useParams } from 'next/navigation'
import { CircularProgress, Box, Typography } from '@mui/material';
import axios from 'axios';
import styles from './index.module.scss'

export default function Account() {
  const { categorySlug, prefix } = useParams()
  const [id, setId] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdBySlug = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetCategoryIdBySlug/${categorySlug}`
          // `https://localhost:7053/api/Categories/GetCategoryIdBySlug/${categorySlug}`
        ); 
        console.log(response)
        setId(response.data.categoryId);
        setCategoryName(response.data.name);

      } catch (err) {
        setError(err.message);
        window.location.href = `/not-found`
      } finally {
        setLoading(false);
      }
    };

    fetchIdBySlug();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="content-container">
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
    </div>
  );
  }
  return (
    <Fragment>
      <div className="content-container">
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
          '@media (min-width: 1350px)':{
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
            <Typography sx={{ color: 'white', flexGrow: 1, fontSize: '1.5rem'}}>
              <span style={{ fontSize: '1.3rem' }}>Sub-Categories for: </span> "{categoryName}"
            </Typography>
          </Box>
        </Box>
        </Box>
      <SubCategory categoryId={Number(id)} prefix={prefix}/>
      </div>
    </Fragment>
  )
}
