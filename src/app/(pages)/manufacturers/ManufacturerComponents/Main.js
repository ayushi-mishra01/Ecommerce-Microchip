import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Grid, Typography, TextField, Tabs, Tab, Link,useMediaQuery } from '@mui/material';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import classes from './index.module.scss'
import CircularProgress from '@mui/material/CircularProgress'

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding: 2rem;
`;

const Header = styled.header`
  background: #002060;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Footer = styled.footer`
  background: #002060;
  padding: 1rem;
  color: white;
  text-align: center;
`;

const PopularManufacturersContainer = styled.div`
  padding-bottom: 2rem;
`;

const ManufacturerImage = styled.img`
  max-width: 100%;
  height: auto;
`;

const manufacturers = [
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/intel.png', slug: 'intel' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/altera.png', slug: 'altera' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/amd.png', slug: 'amd' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/Xilinx_logo.svg.png', slug: 'xilinx' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/Logo-Cypress-1.png', slug: 'cypress-semiconductor-corp' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/NXP-Logo.svg.png', slug: 'nxp-semiconductors' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/Marvell_Logo.svg', slug: 'marvell-semiconductor-inc' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/Lattice_Semiconductor_logo.svg', slug: 'lattice-semiconductor-corporation' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/microsemi-logo-1.png', slug: 'microsemi-corporation' },
  { logo: 'https://www.microchipusa.com/wp-content/uploads/2023/06/Texas-Instruments-Brands-Logo-PNG-Transparent.png', slug: 'texas-instruments' },
];

const Main = () => {
  const [search, setSearch] = useState('');
  const [manufacturersData, setManufacturers] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchManufacturers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer`
        //`https://localhost:7053/api/Manufacturer`
      );
      const data = response.data;
      setManufacturers(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchSearchManufacturer = async (searchTerm) => {
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Manufacturer/getSearchManufacturer?SearchTerm=${encodedSearchTerm}`
        //`https://localhost:7053/api/Manufacturer/getSearchManufacturer?SearchTerm=${encodedSearchTerm}`
      );
      setManufacturers(response.data);
      console.log(response.data)

    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
  };
  const handleLetterClick = (event, newValue) => {
    const char = event.currentTarget.innerText;
    setSelectedLetter(char);
    fetchSearchManufacturer(char);
  };
  const handleSearchClick = () => {
    if (search.trim() == '') {
      fetchManufacturers();
      setSelectedLetter('All Manufacturers')
    }
    else {
      fetchSearchManufacturer(search.trim())
      setSelectedLetter(search.trim());
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

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
  return (
    <Box sx={{ padding: '3%' }}>
      {/* <Container> */}
      {/* <MainContent> */}
      {/* <PopularManufacturersContainer> */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Popular Manufacturers
        </Typography>
      </Box>
        <Grid container spacing={2} mb={5}>
          {manufacturers.map((manufacturer, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Link href={`/manufacturer/${manufacturer.slug}`}>
                <Box textAlign="center" p={2} border={1} borderColor="#ddd" borderRadius={4} sx={{
                  minHeight: '100px', display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <Box component="img"
                    src={manufacturer.logo} alt="Image" maxWidth="100%" sx={{
                      maxWidth: '100%',
                      height: '50px',
                      display: 'block',
                      margin: '0 auto',
                    }} />
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      {/* </PopularManufacturersContainer> */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Manufacturers
        </Typography>
      </Box>
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        {['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((char, index) => (
          <Typography
            key={index}
            sx={{
              color: '#2252ab',
              flex: '1 0 0',
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => handleLetterClick(char)}
          >
            {char}
          </Typography>
        ))}
      </Box> */}
      <Box sx={{ marginTop: '5%' }}>
        <Tabs
          value={selectedLetter}
          onChange={handleLetterClick}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="alphabetical tabs"
          sx={isMobile ? {} : {
            display: 'flex',
            flexDirection: 'row',
            '& .MuiTab-root': {
              flex: '1 0 auto',
              minWidth: '1px',
              display: 'flex',
              justifyContent: 'center',
              padding: '8px 0',
            },
          }}
        >
          {['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((char) => (
            <Tab
              key={char}
              label={char}
              value={char}
              sx={{
                color: '#2252ab',
                '&.Mui-selected': {
                  color: 'blue',
                  fontWeight: 'bold',
                },
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            />
          ))}
        </Tabs>
      </Box>
      <hr style={{ border: '1px solid black', margin: '20px 0', width: '100%', marginLeft: 'auto', marginRight: 'auto', outline: 'none' }} />
      <Box mb={0.25} display="flex" justifyContent="flex-end">
        <TextField
          variant="outlined"
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          size='small'
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box display="flex" justifyContent="flex-start" alignItems="flex-start" mb={4} marginBottom='2px'>
        <Typography variant="h4" component="h1" gutterBottom>
          {selectedLetter || 'All Manufacturers'}
        </Typography>
      </Box>
      <hr style={{ border: '2px solid black', marginBottom: '20px' }} />
      <Grid container spacing={2}>
        {manufacturersData.map((manufacturer, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <a
              href={`/manufacturer/${manufacturer.slug}`}
              style={{ color: '#2252ab', textDecoration: 'none' }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              {manufacturer.name}
            </a>
          </Grid>
        ))}
      </Grid>
      {/* </MainContent> */}
      {/* </Container> */}
    </Box>
  );
};

export default Main;
