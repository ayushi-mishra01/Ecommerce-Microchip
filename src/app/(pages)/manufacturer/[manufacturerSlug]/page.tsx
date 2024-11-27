'use client';
import React, { Fragment, useEffect, useState } from 'react';
import ManufacturerById from './ManufacturerComponents';
import { useParams } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';

export default function Account() {
  const { manufacturerSlug } = useParams(); 
  const [manufacturerId, setManufacturerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchManufacturerId = async () => {
      if (!manufacturerSlug) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/GetManufacturerIdBySlug/${manufacturerSlug}`
          // `https://localhost:7053/api/Manufacturer/GetManufacturerIdBySlug/${manufacturerSlug}`
        ); 
        console.log(response)
        const data = await response.data;
        setManufacturerId(data);
      } catch (error) {
        console.error('Error fetching manufacturer ID:', error);
        window.location.href = `/not-found`
      }
    };

    fetchManufacturerId();
  }, [manufacturerSlug]);

  return (
    <Fragment>
      <div className="content-container">
      {manufacturerId ? (
        <ManufacturerById manufacturerId={manufacturerId} /> 
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

// export const metadata: Metadata = {
//   title: 'Product',
//   description: 'Microchip Product Page.',
//   openGraph: mergeOpenGraph({
//     title: 'Product',
//     url: '/product',
//   }),
// }


