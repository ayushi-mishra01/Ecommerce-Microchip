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
      }
    };

    fetchIdBySlug();
  }, [slug]);

  useEffect(() => {
    if (id) {
      const fetchCategoryHierarchy = async () => {
        try {
          const idInput = [id];
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/getCategoryHierarchy`,
            idInput
          );
          setCategoryData(response.data);
          const foundPath = findDeepestPath(response.data);
          setPath(foundPath);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCategoryHierarchy();
    }
  }, [id]);

  const findDeepestPath = (categories, currentPath = []) => {
    if (!categories || categories.length === 0) {
      return currentPath;
    }

    const category = categories[0]; 
    const newPath = [...currentPath, { name: category.name, slug: category.slug }];

    if (category.subCategories && category.subCategories.length > 0) {
      return findDeepestPath(category.subCategories, newPath);
    }

    return newPath; 
  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Fragment>
      <Categories categoryId={id} path={path} categoryName={categoryName}/>
    </Fragment>
  );
}
