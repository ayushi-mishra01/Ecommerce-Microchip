import React from 'react'
import { Box, Typography, Link, Button } from '@mui/material'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import styles from './index.module.scss'

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
          maxWidth: '1350px', // Confines content to 1350px on larger screens
          margin: '0 auto', // Centers the content within the box
          width: '100%', // Ensures full width within the max-width constraint
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
            flexWrap: 'wrap', // Allow wrapping for responsiveness
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              flexGrow: 1,
              fontSize: '1.8rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {categoryName}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '20rem',
              flexShrink: 0,
              marginTop: { xs: '0.5rem', md: '0' },
            }}
          >
            <Link href="/" sx={{ textDecoration: 'none' }}>
              <Button
                variant="text"
                sx={{
                  textTransform: 'none',
                  color: '#d1d5db',
                  fontSize: '0.75rem',
                  p: 0,
                  mr: '-15px',
                  mb: '2px',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Home
              </Button>
            </Link>
            <Typography
              variant="body1"
              sx={{
                color: '#d1d5db',
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
                p: 0,
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
  )
}

export default CategoryHeader
