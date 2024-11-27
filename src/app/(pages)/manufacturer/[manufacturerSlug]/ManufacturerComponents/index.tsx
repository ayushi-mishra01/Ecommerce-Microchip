'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import classes from './index.module.scss'
import Main from './Main'


const ManufacturerById = ({manufacturerId}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <>
    {show&&(<Main manufacturerId={manufacturerId}/>)}
    </>
  )
}

export default ManufacturerById
