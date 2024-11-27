'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import classes from './index.module.scss'
import RightComponent from './RightComponent'
import LeftComponent from './LeftComponent'

const Contact= () => {

  return (
    <>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} width="100%">
      <Box 
        flex={1} 
        display="flex" 
        sx={{
          margin: '20px',
          justifyContent: 'center',
          '@media (min-width:1350px)': {
            justifyContent: 'flex-start',
          }
        }}
        >
        <LeftComponent />
      </Box>

      <Box flex={1} display="flex" justifyContent="center">
        <RightComponent />
      </Box>
    </Box>
    </>
  )
}

export default Contact
