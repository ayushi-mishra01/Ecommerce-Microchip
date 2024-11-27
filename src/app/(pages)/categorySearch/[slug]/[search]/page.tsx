'use client'
import React, { Fragment, useState, useEffect } from 'react'
import Categories from './CategoriesComponents'
import { useParams } from 'next/navigation'
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';

export default function Account() {
  const { slug, search } = useParams()
  const [id, setId] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdBySlug = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetCategoryIdBySlug/${slug}`
          // `https://localhost:7053/api/Categories/GetCategoryIdBySlug/${slug}`
        ); 
        console.log(response)
        // const data = await response.json();
        setId(response.data.categoryId)
        setCategoryName(response.data.name)
      } catch (err) {
        setError(err.message);
        window.location.href = `/not-found`
      } finally {
        setLoading(false);
      }
    };

    fetchIdBySlug();
  }, [slug]);

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
    );
  }

  return (
    <Fragment>
      <div className="content-container">
        <Categories categoryId={id} search={search} categoryName={categoryName} />
      </div>
    </Fragment>
  )
}
