import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Link from 'next/link';
import styles from './index.module.scss'; 

const Breadcrumb = ({ productName, manufacturerName, categoryName, manufacturerSlug, categorySlug }) => {
  return (
    // <Box
    //   sx={{
    //     bgcolor: '#113163',
    //     py: 3,
    //     width: '100%',
    //     marginBottom: '5px',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     height: '92px'
    //   }}
    // >
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
          marginTop: '1.7rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          flexWrap: 'wrap', 
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap', 
            // justifyContent: 'flex-end', 
            justifyContent: 'flex-start',
            flexGrow: 1, 
            marginTop: { xs: '0.5rem', md: '0' },
            minWidth: '0',
          }}
        >
          <Link href="/">
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
          <Link href="/manufacturers">
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
          <Link href={`/manufacturer/${manufacturerSlug}`}>
            <Typography
              variant="body1"
              sx={{
                color: '#d1d5db',
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1, 
                maxWidth: '100%',
                minWidth: '0', 
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              {manufacturerName}
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
          <Link href={`/manufacturer/${manufacturerSlug}/${categorySlug}`}>
            <Typography
              variant="body1"
              sx={{
                color: '#d1d5db',
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 1, 
                maxWidth: '100%',
                minWidth: '0', 
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              {categoryName}
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
                textDecoration: 'none',
              }}
            >
              {productName}
            </Typography>
        </Box>
      </Box>
    </Box>
    </Box>
  );
};

export default Breadcrumb;