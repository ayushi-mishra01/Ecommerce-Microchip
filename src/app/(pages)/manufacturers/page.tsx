import React, { Fragment } from 'react'
import { Metadata } from 'next'
import styles from './index.module.scss'
import Link from 'next/link'
import { Box, Grid, TextField, Typography, Button } from '@mui/material'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Manufacturer from './ManufacturerComponents'


export default function Account() {
  // const { user } = await getMeUser({
  //   nullUserRedirect: `/login?error=${encodeURIComponent(
  //     'You must be logged in to access your account.',
  //   )}&redirect=${encodeURIComponent('/myhome')}`,
  // })

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
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', flexGrow: 1, fontSize: '1.8rem' }}>
           Manufacturers
          </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '20rem' }}>
              <Link href="/">
                <Button
                  variant="text"
                  sx={{
                    textTransform: 'none',
                    color: '#d1d5db', 
                    fontSize: '0.75rem',
                    p: 0,
                    mr: '-15px',
                    '&:hover': {
                      color: 'white', 
                    },
                  }}
                >
                  Home
                </Button>
              </Link>
              <Typography variant="body1" sx={{ color: '#d1d5db', mx: 0.2, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <ArrowRightIcon fontSize="small" />
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  // whiteSpace: 'nowrap',
                  // overflow: 'hidden',
                  // textOverflow: 'ellipsis',
                  fontSize: '0.75rem',
                  p: 0,
                  // '&:hover': {
                  //   color: 'white', 
                  // },
                }}
              >
                Manufacturers
              </Typography>
            </Box>
        </Box>
      </Box>
      </Box>
      <Manufacturer/>
      </div>
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Manufacturers',
  description: 'Microchip Manufacturer Page.'
}
