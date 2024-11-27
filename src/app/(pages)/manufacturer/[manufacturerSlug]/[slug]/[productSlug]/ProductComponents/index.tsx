'use client'
import * as React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import classes from './index.module.scss'
import LeftComponent from './LeftComponent'
import RightComponent from './RightComponent'
import Cards from './Cards'
import BottomComponent from './BottomComponent'
import ImageSlider from './ImageSlider'
import axios from 'axios'

const Product = ({ id, manufacturerSlug, categorySlug }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null)
  const [parameters, setParameters] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [countries, setCountries] = useState([]);
  const fetchData = async () => {
    try {
      setLoading(true)
      const response1 = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/${id}`,
      )
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/GetParametersByProduct/${id}`,
      )
      const response3 = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq/countries`);
      setCountries(response3.data)
      setData(response1.data)
      setParameters(response2.data)
      document.title = response1.data.name
      // localStorage.setItem('id', id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    setShow(true);
    fetchData();
  }, [id]);
  if (loading) return <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
  if (error) return <p>{error}</p>
  return (
    <Box className={classes.main}>
      <Box className={classes.gridbox}>
        <Box className={classes.main1}>
          {show && (<LeftComponent id={id} data={data} parameters={parameters} mnanufacturerSlug={manufacturerSlug} categorySlug={categorySlug} />)}
        </Box>
        <Box className={classes.main2}>
          {show && (<RightComponent data={data} countries={countries} />)}
        </Box>
      </Box>
      {show && (<Cards />)}
      {show && (<ImageSlider />)}
      {show && (<BottomComponent />)}
    </Box>
  )
}

export default Product
