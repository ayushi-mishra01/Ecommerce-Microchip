'use client';
import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Categories from './CategoriesComponents';
import { CircularProgress, Box, Typography } from '@mui/material';
import axios from 'axios';

export default function Account() {
  const { slug } = useParams();
  const [id, setId] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [path, setPath] = useState([]);

  useEffect(() => {
    const fetchIdBySlug = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetCategoryIdBySlug/${slug}`
        );
        setId(response.data.categoryId);
        setCategoryName(response.data.name);
      } catch (err) {
        setError(err.message);
        window.location.href = `/not-found`;
      } finally{
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

  // if (error) {
  //   return <Typography>Error: {error}</Typography>;
  // }

  return (
    <Fragment>
      <div className="content-container">
        <Categories categoryId={id} categoryName={categoryName}/>
      </div>
    </Fragment>
  );
}
