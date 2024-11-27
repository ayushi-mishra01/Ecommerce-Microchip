import React, { Fragment } from 'react'
import Contact from './ContactComponents'
import { mergeOpenGraph } from '@/app/_utilities/mergeOpenGraph'
import { Metadata } from 'next'
import {Box, Typography, Button, Link } from '@mui/material'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

export default function Account() {
  return (
    <Fragment>
      <div className="content-container">
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
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', flexGrow: 1, fontSize: '1.8rem' }}>
           Contact
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
                  fontSize: '0.75rem',
                  p: 0,
                }}
              >
                Contact
              </Typography>
            </Box>
        </Box>
      </Box>
      </Box>
        <Contact />
        </div>
    </Fragment>
  )
}
export const metadata: Metadata = {
  title: 'Contact',
  description: 'Microchip Contact Page.',
  openGraph: mergeOpenGraph({
    title: 'Product',
    url: '/product',
  }),
}


