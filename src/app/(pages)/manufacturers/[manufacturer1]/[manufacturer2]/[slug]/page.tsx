'use client'
import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Categories from './CategoriesComponents'
import axios from 'axios'
import { CircularProgress, Box } from '@mui/material'

export default function Account() {
  const { manufacturer1, manufacturer2, slug } = useParams()
  const [id, setId] = useState(0)
  const [manufacturerId1, setManufacturerId1] = useState(0)
  const [manufacturerName1, setManufacturerName1] = useState('')
  const [manufacturerId2, setManufacturerId2] = useState(0)
  const [manufacturerName2, setManufacturerName2] = useState('')
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

        const manufacturerRes1 = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/GetManufacturerIdBySlug/${manufacturer1}`,
          // `https://localhost:7053/api/Manufacturer/GetManufacturerIdBySlug/${manufacturerSlug}`
        )
        console.log('manufacturer response: ', manufacturerRes1.data)
        const data1 = await manufacturerRes1.data
        setManufacturerId1(data1)

        const manufacturerRes2 = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/GetManufacturerIdBySlug/${manufacturer2}`,
          // `https://localhost:7053/api/Manufacturer/GetManufacturerIdBySlug/${manufacturerSlug}`
        )
        console.log('manufacturer response: ', manufacturerRes2.data)
        const data2 = await manufacturerRes2.data
        setManufacturerId2(data2)
      } catch (err) {
        setError(err.message)
        window.location.href = `/not-found`
      } finally {
        setLoading(false)
      }
    }

    fetchIdBySlug()
  }, [slug, manufacturer1, manufacturer2])

  const fetchManufacturers = async () => {
    try {
      const response1 = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/${manufacturerId1}`,
      )
      setManufacturerName1(response1.data)

      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/${manufacturerId2}`,
      )
      setManufacturerName2(response2.data)
    } catch (error) {
      console.error('Error fetching manufacturers:', error)
    }
  }
  useEffect(() => {
    fetchManufacturers()
  }, [manufacturerId1, manufacturerId2])

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
          manufacturerId1={manufacturerId1}
          manufacturerName1={manufacturerName1}
          manufacturerId2={manufacturerId2}
          manufacturerName2={manufacturerName2}
          categoryName={categoryName}
        />
      </div>
    </Fragment>
  )
}
