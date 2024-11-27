'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import classes from './index.module.scss'
import Main from './Main'


const ManufacturerById = ({manufacturerIds}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    console.log(manufacturerIds)
    setShow(true);
  }, []);
  return (
    <>
    {show&&(<Main manufacturerIds={manufacturerIds}/>)}
    </>
  )
}

export default ManufacturerById
