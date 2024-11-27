'use client';
import React, { Fragment, useEffect, useState } from 'react';
import ManufacturerById from './ManufacturerComponents';
import { useParams } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';

export default function Account() {
  const { manufacturer1, manufacturer2 } = useParams();
  const manufacturer1Slug = Array.isArray(manufacturer1) ? manufacturer1[0] : manufacturer1;
  const manufacturer2Slug = Array.isArray(manufacturer2) ? manufacturer2[0] : manufacturer2;
  const [manufacturerIds, setManufacturerIds] = useState<{ [key: string]: number | null }>({
    manufacturer1: null,
    manufacturer2: null,
  });

  useEffect(() => {
    document.title='Manufacturers';

    const fetchManufacturerId = async (slug: string, key: string) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/GetManufacturerIdBySlug/${slug}`
        );
        const data = await response.data;
        setManufacturerIds((prevIds) => ({ ...prevIds, [key]: data }));
      } catch (error) {
        console.error(`Error fetching manufacturer ID for ${slug}:`, error);
        window.location.href = `/not-found`;
      }
    };

    if (manufacturer1) fetchManufacturerId(manufacturer1Slug, 'manufacturer1');
    if (manufacturer2) fetchManufacturerId(manufacturer2Slug, 'manufacturer2');
  }, [manufacturer1, manufacturer2]);

  const allIdsLoaded = Object.values(manufacturerIds).every((id) => id !== null);

  return (
    <Fragment>
      <div className="content-container">
      {allIdsLoaded ? (
        <ManufacturerById manufacturerIds={manufacturerIds} />
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