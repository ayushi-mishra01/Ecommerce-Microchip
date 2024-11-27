'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import classes from './index.module.scss'
import RfqForm from './RfqForm'

const Rfq= () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    document.title = 'RFQ'
    setShow(true);
  }, []);
  return (
    <Box className={classes.main}>
      <RfqForm/>
    </Box>
  )
}

export default Rfq
