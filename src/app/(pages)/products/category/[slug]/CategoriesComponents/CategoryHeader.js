import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import styles from './index.module.scss'; 

const CategoryHeader = ({ categoryName }) => {
  return (
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
            {categoryName}
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
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ArrowRightIcon fontSize="small" />
            </Typography>
            <Link href="/products" sx={{ textDecoration: 'none' }}>
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
                Products
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
                  color: '#d1d5db',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                {categoryName}
              </Typography>
            
          </Box>
        </Box>
      </Box>
    </Box>

  );
};

export default CategoryHeader;