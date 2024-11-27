// 'use client';
// import React, { Fragment, useState, useEffect } from 'react';
// import Product from './ProductComponents';
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import { CircularProgress, Box } from '@mui/material';
// import { Typography, Button } from '@mui/material'
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';
// import Link from 'next/link'

// import styles from './index.module.scss'

// export default function Account() {
//   const { manufacturerSlug, categorySlug, productSlug } = useParams();
//   const [productId, setProductId] = useState<number | null>(null);

//   useEffect(()=>{
//     const getProductId= async ()=>{
//       if (!productSlug) return;
//       try{
//         const slugInput={
//           manufacturerSlug : manufacturerSlug,
//           categorySlug : categorySlug,
//           productSlug : productSlug,

//         }
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/GetProductIdBySlug`,
//           // `https://localhost:7053/api/Products/GetProductIdBySlug`,
//           slugInput,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           },
//         );
//         const data = await response.data;
//         setProductId(data);
        
//       }catch(error){
//         window.location.href=`/not-found`
//       }
//     }

//     getProductId();

//   }, [productSlug])

//   return (
//     <Fragment>
//       <Box
//         sx={{
//           bgcolor: '#113163',
//           py: 3,
//           width: '100%',
//           marginBottom: '5px',
//           display: 'flex',
//           flexDirection: 'column',
//           // height:"94px"
//         }}
//       >
//         <Box
//           sx={{
//             marginLeft: '2rem',
//             marginTop: '0.6rem',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             px: 2,
//             flexWrap: 'wrap', 
//           }}
//         >
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 width: '20rem',
//                 flexShrink: 0, 
//                 marginTop: { xs: '0.5rem', md: '0' }, 
//               }}
//             >
//               <Link href="/">
//                 <Button
//                   variant="text"
//                   sx={{
//                     textTransform: 'none',
//                     color: '#d1d5db',
//                     fontSize: '0.75rem',
//                     p: 0,
//                     mr: '-15px',
//                     mb: '2px',
//                     '&:hover': {
//                       color: 'white',
//                     },
//                   }}
//                 >
//                   Home
//                 </Button>
//               </Link>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   color: '#d1d5db',
//                   mx: 0.2,
//                   fontSize: '0.75rem',
//                   display: 'flex',
//                   alignItems: 'center',
//                 }}
//               >
//                 <ArrowRightIcon fontSize="small" />
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   color: '#d1d5db',
//                   mt: '3px',
//                   fontSize: '0.8rem',
//                   p: 0,
//                   '&:hover': {
//                     color: 'white',
//                   },
//                 }}
//               >
//                 Product
//               </Typography>
//             </Box>
//         </Box>
//       </Box>
//       {productId?(
//         <Product id={Number(productId)} manufacturerSlug={manufacturerSlug} categorySlug={categorySlug}/>
//       ) : (
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '100vh',
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       )}
//     </Fragment>
//   )
// }
// // export const metadata: Metadata = {
// //   title: 'Product',
// //   description: 'Microchip Product Page.',
// //   openGraph: mergeOpenGraph({
// //     title: 'Product',
// //     url: '/product',
// //   }),
// // }


'use client';
import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { CircularProgress, Box, Typography } from '@mui/material';
import Product from './ProductComponents';
import Breadcrumb from './Breadcrumb';

export default function CategoryProductPage() {
  const { manufacturerSlug, slug, productSlug } = useParams();
  const [categoryId, setCategoryId] = useState(null);
  const [productName, setProductName] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [path, setPath] = useState([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryBySlug = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetCategoryIdBySlug/${slug}`
        );
        setCategoryId(response.data.categoryId);
      } catch (err) {
        setError(err.message);
        window.location.href = '/not-found';
      }
    };

    if (slug) {
      fetchCategoryBySlug();
    }
  }, [slug]);

  // useEffect(() => {
  //   if (categoryId) {
  //     const fetchCategoryHierarchy = async () => {
  //       try {
  //         const idInput = [categoryId];
  //         const response = await axios.post(
  //           `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/getCategoryHierarchy`,
  //           idInput
  //         );
  //         setCategoryData(response.data);
  //         const foundPath = findDeepestPath(response.data);
  //         setPath(foundPath);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchCategoryHierarchy();
  //   }
  // }, [categoryId]);

  useEffect(() => {
    const fetchProductBySlug = async () => {
      if (!productSlug) return;
      try {
        const slugInput = {
          manufacturerSlug: manufacturerSlug,
          categorySlug: slug,
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
        setManufacturerName(response.data.manufacturer)
        setCategoryName(response.data.category)
      } catch (err) {
        setError(err.message);
        window.location.href = '/not-found';
      }
    };

    fetchProductBySlug();
  }, [manufacturerSlug, slug, productSlug]);

  // const findDeepestPath = (categories, currentPath = []) => {
  //   if (!categories || categories.length === 0) {
  //     return currentPath;
  //   }

  //   const category = categories[0];
  //   const newPath = [...currentPath, { name: category.name, slug: category.slug }];

  //   if (category.subCategories && category.subCategories.length > 0) {
  //     return findDeepestPath(category.subCategories, newPath);
  //   }

  //   console.log(path)
  //   return newPath;
  // };

  return (
    <Fragment>
      <div className="content-container">
      <Breadcrumb productName={productName} manufacturerName={manufacturerName} categoryName={categoryName} manufacturerSlug={manufacturerSlug} categorySlug={slug}/>
      {productId ? (
        <Product id={Number(productId)} manufacturerSlug={manufacturerSlug} categorySlug={slug} />
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
