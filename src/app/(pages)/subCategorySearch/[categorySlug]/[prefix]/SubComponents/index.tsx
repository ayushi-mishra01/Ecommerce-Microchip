'use client'
import * as React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import classes from './index.module.scss'
import RightComponent from './RightComponent'


const SubCategory = ({categoryId, prefix}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    document.title="Search Results";
  }, []);
  return (
    <Box className={classes.main}>
      {show&&(<RightComponent categoryId={categoryId} prefix={prefix}/>)}
    </Box>
  )
}

export default SubCategory
