'use client';
import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { CircularProgress, Box, Typography, Breadcrumbs } from '@mui/material';
import Product from './ProductComponents';
import Breadcrumb from './Breadcrumb';

export default function CategoryProductPage() {
  const { manufacturerSlug, categorySlug, productSlug } = useParams();
  const [categoryId, setCategoryId] = useState(null);
  const [productName, setProductName] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [path, setPath] = useState([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryBySlug = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetCategoryIdBySlug/${categorySlug}`
        );
        setCategoryId(response.data.categoryId);
      } catch (err) {
        setError(err.message);
        window.location.href = '/not-found';
      }
    };

    if (categorySlug) {
      fetchCategoryBySlug();
    }
  }, [categorySlug]);

  useEffect(() => {
    if (categoryId) {
      const fetchCategoryHierarchy = async () => {
        try {
          const idInput = [categoryId];
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
  }, [categoryId]);

  useEffect(() => {
    const fetchProductBySlug = async () => {
      if (!productSlug) return;
      try {
        const slugInput = {
          manufacturerSlug: manufacturerSlug,
          categorySlug: categorySlug,
          productSlug: productSlug,
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/GetProductIdBySlug`,
          //`https://localhost:7053/api/Products/GetProductIdBySlug`,
          slugInput,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.data.productId;
        setProductId(data);
        setProductName(response.data.name)
      } catch (err) {
        setError(err.message);
        window.location.href = '/not-found';
      }
    };

    fetchProductBySlug();
  }, [manufacturerSlug, categorySlug, productSlug]);

  const findDeepestPath = (categories, currentPath = []) => {
    if (!categories || categories.length === 0) {
      return currentPath;
    }

    const category = categories[0];
    const newPath = [...currentPath, { name: category.name, slug: category.slug }];

    if (category.subCategories && category.subCategories.length > 0) {
      return findDeepestPath(category.subCategories, newPath);
    }

    console.log(path)
    return newPath;
  };

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
      <Breadcrumb productName={productName} path={path}/>
      {productId ? (
        <Product id={Number(productId)} manufacturerSlug={manufacturerSlug} categorySlug={categorySlug} />
      ) : (
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
      )}
      </div>
    </Fragment>
  );
}
