'use client'
import * as React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import classes from './index.module.scss'
import LeftComponent from './LeftComponent'
import RightComponent from './RightComponent'


const SubCategory = ({categoryId}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    document.title="Sub-Categories"
  }, []);
  return (
    <Box className={classes.main}>
      {/* <Box className={classes.left}>
      {show&&(<LeftComponent categoryId={categoryId}/>)}
      </Box> */}
      {show&&(<RightComponent categoryId={categoryId}/>)}
    </Box>
  )
}

export default SubCategory
