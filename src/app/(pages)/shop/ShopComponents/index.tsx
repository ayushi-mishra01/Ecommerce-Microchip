'use client'
import * as React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import classes from './index.module.scss'
import MainComponent from './MainComponent'


const Shop= () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <Box className={classes.main}>
      {show&&(<MainComponent />)}
    </Box>
  )
}

export default Shop
