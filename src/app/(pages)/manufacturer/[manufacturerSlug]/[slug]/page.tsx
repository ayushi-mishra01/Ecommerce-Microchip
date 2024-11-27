'use client'
import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Categories from './CategoriesComponents'
import axios from 'axios'
import { CircularProgress, Box } from '@mui/material'

export default function Account() {
  const { manufacturerSlug, slug } = useParams()
  const [id, setId] = useState(0)
  const [manufacturerId, setManufacturerId] = useState(0)
  const [manufacturerName, setManufacturerName] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchIdBySlug = async () => {
      try {
        const categoryRes = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetCategoryIdBySlug/${slug}`,
          // `https://localhost:7053/api/Categories/GetCategoryIdBySlug/${slug}`
        )
        console.log('category response: ', categoryRes)
        setId(categoryRes.data.categoryId)
        setCategoryName(categoryRes.data.name)

        const manufacturerRes = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/GetManufacturerIdBySlug/${manufacturerSlug}`,
          // `https://localhost:7053/api/Manufacturer/GetManufacturerIdBySlug/${manufacturerSlug}`
        )
        console.log('manufacturer response: ', manufacturerRes.data)
        const data = await manufacturerRes.data
        setManufacturerId(data)
      } catch (err) {
        setError(err.message)
        window.location.href = `/not-found`
      } finally {
        setLoading(false)
      }
    }

    fetchIdBySlug()
  }, [slug, manufacturerSlug])

  const fetchManufacturers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/${manufacturerId}`,
      )
      setManufacturerName(response.data)
      // document.title = response.data.name
    } catch (error) {
      console.error('Error fetching manufacturers:', error)
    }
  }
  useEffect(() => {
    fetchManufacturers()
  }, [manufacturerId])

  if (loading) {
    return (
      <div className="content-container">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </div>
    )
  }

  return (
    <Fragment>
      <div className="content-container">
        <Categories
          categoryId={id}
          manufacturerId={manufacturerId}
          manufacturerName={manufacturerName}
          categoryName={categoryName}
        />
      </div>
    </Fragment>
  )
}
