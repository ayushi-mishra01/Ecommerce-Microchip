'use client'
import * as React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import c1 from './assets/c1.jpg'
import c2 from './assets/c2.jpg'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { useMediaQuery } from 'react-responsive'
import { useRef } from 'react'
import classes from './index.module.scss'
import Box from '@mui/material/Box'
import Slider from 'react-slick'
import { Typography } from '@mui/material'

const products = [
  
  {
    id: 643061,
    name: "XCVU57P-L2FSVK2892E",
    sku: "XCVU57P-L2FSVK2892E-P1",
    description: "IC FPGA VIRTEX-UP LP 2892BGA",
    manufacturer: "amd",
    category: "fpgas-field-programmable-gate-array",
    image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/4741/122%7E2892FCBGA-4%2C51-55x55%7EFSVH%7E2892.JPG`,
  },
  {
    id: 643062,
    name: "XCVU47P-3FSVH2892E",
    sku: "XCVU47P-3FSVH2892E-P1",
    description: "IC FPGA 624 I/O 2892FCBGA",
    manufacturer: "amd",
    category: "fpgas-field-programmable-gate-array",
    image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/4741/122%7E2892FCBGA-4%2C51-55x55%7EFSVH%7E2892.JPG`,
  },
  {
    id: 643063,
    name: "XCVU57P-3FSVK2892E",
    sku: "XCVU57P-3FSVK2892E-P1",
    description: "IC FPGA VIRTEX-UP 2892BGA",
    manufacturer: "amd",
    category: "fpgas-field-programmable-gate-array",
    image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/4741/122%7E2892FCBGA-4%2C51-55x55%7EFSVH%7E2892.JPG`,
  },
  {
    id: 643064,
    name: "MM74HC251N",
    sku: "MM74HC251N",
    description: "IC MULTIPLEXER 1 X 8:1 16DIP",
    manufacturer: "onsemi",
    category: "signal-switches-multiplexers-decoders",
    image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/4955/488%3BMKT-N16E%3B%3B16.jpg`,
  },
  {
    id: 643066,
    name: "EL5172ISZ-T7",
    sku: "EL5172ISZ-T7-P1",
    description: "IC OPAMP DIFF 1 CIRCUIT 8SOIC",
    manufacturer: "renesas-electronics-corporation",
    category: "instrumentation-op-amps-buffer-amps",
    image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/389/8-SOIC.jpg`,
  },
  {
    id: 643067,
    name: "PTLV9062SIDGST",
    sku: "PTLV9062SIDGST",
    description: "OP AMP",
    manufacturer: "texas-instruments",
    category: "instrumentation-op-amps-buffer-amps",
    image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/375/296%3B4040047-3%3BD%3B8.jpg`,
  },
  {
    id: 643068,
    name: "L6910GTR",
    sku: "L6910GTR-P1",
    description: "IC REG CTRLR BUCK 16SOIC",
    manufacturer: "stmicroelectronics",
    category: "dc-dc-switching-controllers",
    image: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/494/497%7E16SOIC-3%2C9%7ED%7E16.jpg`,
  },
 
];

// const ImageSlider = () => {
//   const sliderRef = useRef(null)
//   const isMediumScreen = useMediaQuery({ query: '(max-width: 900px)' })
//   const isSmallScreen = useMediaQuery({ query: '(max-width: 500px)' })
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
//     slidesToScroll: 1,
//     arrows: false,
//   }
//   const goToPrev = () => sliderRef.current.slickPrev()
//   const goToNext = () => sliderRef.current.slickNext()
//   return (
//     <>
//       <Box position="relative" className={classes.imageslider}>
//       <Typography variant="h5" color="text.secondary" ml={4} mb={4}>
//         Clients Also Buy
//           </Typography>
//         <Slider {...settings} ref={sliderRef} className={classes.newsSlider}>
//           {products.map((product) => (
//           <Box
//             key={product.id}
//             className={classes.caro}
//             onClick={() => window.location.href = `/product/${product.manufacturer}/${product.category}/${product.sku}`}
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               cursor: 'pointer',
//             }}
//           >
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <Box
//                 component="img"
//                 src={product.image}
//                 alt="product image"
//                 className={classes.sliderimg}
//               />
//               <Box className={classes.carop} sx={{ textAlign: 'center', marginLeft: 2 }}>
//                 <Typography variant="h6" color="black"
//                   onClick={() => window.location.href = `/product/${product.manufacturer}/${product.category}/${product.sku}`}
//                 >
//                   {product.name}
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary">
//                   {product.description}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         ))}
//         </Slider>
//         <Box className={classes.sliderNavigation}>
//           <button className={classes.sliderButtonPrev} onClick={goToPrev}>
//             <ChevronLeft className={classes.iconSize} />
//           </button>
//           <button className={classes.sliderButtonNext} onClick={goToNext}>
//             <ChevronRight className={classes.iconSize} />
//           </button>
//         </Box>
//       </Box>
//     </>
//   )
// }
const ImageSlider = () => {
  const sliderRef = useRef(null);
  const isMediumScreen = useMediaQuery({ query: '(max-width: 900px)' });
  const isSmallScreen = useMediaQuery({ query: '(max-width: 500px)' });
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
    slidesToScroll: 1,
    arrows: false,
  };

  const goToPrev = () => sliderRef.current.slickPrev();
  const goToNext = () => sliderRef.current.slickNext();

  return (
    <>
      <Box position="relative" className={classes.imageslider}>
        <Typography variant="h5" color="text.secondary" ml={4} mb={4}>
          Clients Also Buy
        </Typography>
        <Slider {...settings} ref={sliderRef} className={classes.newsSlider}>
          {products.map((product) => (
            <Box
              key={product.id}
              className={classes.caro}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <Box
                onClick={() => {
                  window.location.href = `/product/${product.manufacturer}/${product.category}/${product.sku}`;
                }}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt="product image"
                  className={classes.sliderimg}
                />
                <Box className={classes.carop} sx={{ textAlign: 'center', marginLeft: 2 }}>
                  <Typography variant="h6" color="black">
                    {product.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {product.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
        <Box className={classes.sliderNavigation}>
          <button className={classes.sliderButtonPrev} onClick={goToPrev}>
            <ChevronLeft className={classes.iconSize} />
          </button>
          <button className={classes.sliderButtonNext} onClick={goToNext}>
            <ChevronRight className={classes.iconSize} />
          </button>
        </Box>
      </Box>
    </>
  );
};


export default ImageSlider
