import { Box, Typography, Grid, Paper, useMediaQuery, Link, Button, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import classes from './index.module.scss'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import image16 from './assets/image16.png'
import CircularProgress from '@mui/material/CircularProgress'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-x: auto;
`;
const Main = ({ manufacturerId }) => {
  const [manufacture, setManufacture] = useState(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoriesData, setCategoriesData] = useState([]);
  const [description, setDescription] = useState([]);
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      const response3 = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/getCategoriesByManufacturer/${manufacturerId}`
      );
      const response2 = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/${manufacturerId}`);
      //const response2 = await axios.get(`https://localhost:7053/api/Manufacturer/${manufacturerId}`);
      setManufacture(response2.data)
      setCategoriesData(response3.data)
      setDescription(response2.data.description.split('\n'))
      document.title=response2.data.name;
      console.log(response2.data)
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchManufacturers();
  }, [manufacturerId]);

  const handleError = () => {
    setIsImageLoaded(false);
  };

  const isSmallWidth = useMediaQuery('(max-width:900px)')
  // const fetchSearchManufacturer = async (searchTerm) => {
  //   try {
  //     const encodedSearchTerm = encodeURIComponent(searchTerm);
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/getSearchManufacturer?SearchTerm=${encodedSearchTerm}`);
  //     setManufacturers(response.data);

  //   } catch (error) {
  //     console.error('Error fetching manufacturers:', error);
  //   }
  // };
  // const handleLetterClick = (event, newValue) => {
  //   const char = event.currentTarget.innerText;
  //   setSelectedLetter(char);
  //   fetchSearchManufacturer(char);
  // };
  // const handleSearchClick = () => {
  //   if (search.trim() == '') {
  //     fetchManufacturers();
  //     setSelectedLetter('All Manufacturers')
  //   }
  //   else {
  //     fetchSearchManufacturer(search.trim())
  //     setSelectedLetter(search.trim());
  //   }
  // };
  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSearchClick();
  //   }
  // };
  if (loading) return <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  }}
>
  <CircularProgress />
</Box>
  if (error) return <p>{error}</p>
  return (
    <>
      {manufacture.name ? 
      // <Box sx={{ bgcolor: '#113163', py: 3, width: '100%', marginBottom: '5px' }}>
      //   <Box
      //     sx={{
      //       maxWidth: '1200px',
      //       margin: 'auto',
      //       display: 'flex',
      //       alignItems: 'center',
      //       justifyContent: 'space-between',
      //       px: 2,
      //     }}
      //   >
      //     <Typography variant="h5" className={classes.headerFont} sx={{ color: 'white', flexGrow: 1, fontSize: '1.9rem' }}>
      //       {manufacture.name}
      //     </Typography>
      //     {!isSmallWidth && (
      //     <Box sx={{ display: 'flex', alignItems: 'center', width: '20rem' }}>
      //       <Link href="/">
      //         <Button
      //           variant="text"
      //           sx={{
      //             textTransform: 'none',
      //             color: '#d1d5db', 
      //             fontSize: '0.75rem',
      //             p: 0,
      //             mr: '-15px',
      //             mb: '2px',
      //             '&:hover': {
      //               color: 'white', 
      //             },
      //           }}
      //         >
      //           Home
      //         </Button>
      //       </Link>
      //       <Typography variant="body1" sx={{ color: '#d1d5db', mx: 0.2, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
      //         <ArrowRightIcon fontSize="small" />
      //       </Typography>
      //       <Link href="/manufacturers">
      //           <Button
      //             variant="text"
      //             sx={{
      //               textTransform: 'none',
      //               color: '#d1d5db',
      //               fontSize: '0.75rem',
      //               p: 0,
      //               mb: '2px',
      //               '&:hover': {
      //                 color: 'white',
      //               },
      //             }}
      //           >
      //             Manufacturers
      //           </Button>
      //         </Link>
      //         <Typography variant="body1" sx={{ color: '#d1d5db', mx: 0.2, fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
      //         <ArrowRightIcon fontSize="small" />
      //       </Typography>
      //       <Tooltip title={manufacture.name} arrow>
      //             <Typography
      //               variant="body1"
      //               sx={{
      //                 color: '#d1d5db',
      //                 fontSize: '0.75rem',
      //                 overflow: 'hidden',
      //                 textOverflow: 'ellipsis',
      //                 display: '-webkit-box',
      //                 WebkitBoxOrient: 'vertical',
      //                 WebkitLineClamp: 1, 
      //                 maxWidth: '100%', 
      //               }}
      //             >
      //                {manufacture.name}
      //             </Typography>
      //           </Tooltip>
      //     </Box>
      //   )}
      //   </Box>
      // </Box> 
    //   <Box
    //   sx={{
    //     bgcolor: '#113163',
    //     py: 3,
    //     width: '100%',
    //     marginBottom: '5px',
    //     display: 'flex',
    //     flexDirection: 'column',
    //   }}
    // >
    <Box
      sx={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#113163',
        padding: '10px 20px',
        height: '6rem',
        '@media (min-width: 1300px)': {
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          width: '99.3vw',
        },
      }}
    >
      <Box
        sx={{
          maxWidth: '1350px', // Confines content to 1350px on larger screens
          margin: '0 auto', // Centers the content within the box
          width: '100%', // Ensures full width within the max-width constraint
          display: 'flex',
          flexDirection: 'column',
        }}
      >
      <Box
        sx={{
          marginLeft: '2rem',
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            flexGrow: 1,
            fontSize: '1.8rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
            maxWidth: '100%', 
          }}
        >
         {manufacture.name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center', 
            flexGrow: 1, 
            marginTop: { xs: '0.5rem', md: '0' },
            minWidth: '0', 
          }}
        >
          <Link href="/" sx={{ textDecoration: 'none' }}>
            <Typography
              variant="body1"
              sx={{
                color: '#d1d5db',
                fontSize: '0.75rem',
                textDecoration: 'none',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Home
            </Typography>
          </Link>
          <Typography
            variant="body1"
            sx={{
              color: '#d1d5db',
              mx: 0.2,
              textDecoration: 'none',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowRightIcon fontSize="small" />
          </Typography>
          <Link href="/manufacturers" sx={{ textDecoration: 'none' }}>
            <Typography
              variant="body1"
              sx={{
                color: '#d1d5db',
                fontSize: '0.75rem',
                textDecoration: 'none',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Manufacturers
            </Typography>
          </Link>
          <Typography
            variant="body1"
            sx={{
              color: '#d1d5db',
              mx: 0.2,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowRightIcon fontSize="small" />
          </Typography>
            {/* <Tooltip title={manufacture.name} arrow> */}
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                  maxWidth: '100%',
                  minWidth: '0',
                }}
              >
                  {manufacture.name}
              </Typography>
            {/* </Tooltip> */}
        </Box>
      </Box>
    </Box>
    </Box>
      : null}
      <Container>
        <MainContent>
        {manufacture.logoUrl && isImageLoaded && (
          <Box
            component="img"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/manufacturers/${manufacture.logoUrl}.jpg`}
            //src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/manufacturers/3Mq.jpg`}
            alt="Image"
            onError={handleError}
            sx={{
              float: 'right',
              marginLeft: '16px',
              marginBottom: '16px',
              maxWidth: '210px',
              height: 'auto',
              marginTop: '3%'
            }}
          />)}

          <Box
            component="p" 
            className={classes.standardFont}
            sx={{
              fontSize: '5px',
              lineHeight: '1.6',
              justifyContent: 'right'
            }}
          >
            {description.map((paragraph, index) => (
            <Typography  component="h1" mb={3}> 
            {paragraph}
            </Typography>
      ))}
          </Box>
          <Box className={classes.categories}>
            <Typography variant="h4" className={classes.accentFont} align='center' mb={3}>
              Product Categories
            </Typography>
            <Grid container spacing={2}>
              {categoriesData.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper
                    key={category.categoryId}
                    className={classes.productc}
                    elevation={3}
                    // style={{ textAlign: 'center', margin: '10px', height: 'auto', minHeight: '280px' }}
                    sx={{
                      textAlign: 'center',
                      margin: '10px',
                      height: 'auto',
                      minHeight: '280px',
                      transition: 'transform 0.3s, box-shadow ease 0.3s', 
                      '&:hover': {
                        transform: 'scale(1.0)',
                        boxShadow: '0 5px 9px rgba(0, 0, 0, 0.4)',
                      },
                    }}
                  >
                    {/* <img src={image17.src} alt={category.name} style={{ width: "100px" }} /> */}
                    <img 
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/categories/${category.picture}.png`}
                      alt={category.name} 
                      style={
                        { 
                          width: '100px',
                          border:'2px solid #122050',
                          borderRadius: '8px',   
                          padding: '5px'
                        }
                      } 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = image16.src;
                      }}
                    />
                    <Typography variant="h7" fontWeight="bold" component="p" mt={2} mb={2}>
                      {category.name}
                    </Typography>
                    <Link href={`/manufacturer/${manufacture.slug}/${category.slug}`} sx={{ textDecoration: 'none' }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#f5d949',
                          color: 'black',
                          width: '120px',
                          fontSize: '10px',
                          marginTop: '5px',
                          fontWeight: 'bold',
                          '&:hover': {
                            backgroundColor: '#113163',
                            color: 'white',
                          }
                        }}
                      >
                        PRODUCTS
                      </Button>
                    </Link>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </MainContent>
      </Container>
    </>
  );
};

export default Main;
