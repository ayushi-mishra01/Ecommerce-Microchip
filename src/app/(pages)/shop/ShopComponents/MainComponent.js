'use client'
import classes from './index.module.scss'
import { useState, useEffect } from 'react'
import * as React from 'react'
import Button from '@mui/material/Button'
import { Typography, Grid, TextField } from '@mui/material'
import axios from 'axios'
import c1 from './assets/c1.jpg'
import Box from '@mui/material/Box'
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { useRouter } from 'next/router';
import { Link } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const buttonGroups = [
  { label1: 'INTEL', label2: 'ALTERA' },
  { label1: 'AMD', label2: 'XILINX' },
  { label1: 'NXP', label2: 'ANALOG DEVICES' },
  { label1: 'TI', label2: 'STMICRO' },
]
const MainComponent = () => {
  const [products, setProducts] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const pageSize = 30
  useEffect(() => {
    fetchProducts(pageNumber, pageSize)
    fetchCategories();
  }, [pageNumber]);
  const handleSearchChange = () => {
    setPageNumber(1);
    if (searchTerm.trim() === '') {
      fetchProducts(pageNumber, pageSize);
    } else {
      fetchSearchProducts(searchTerm.trim(), pageNumber, pageSize);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories`);
      // const filteredCategories = response.data.filter(category => category.level === 1);
      const sortedCategories = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (page, size) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products?pageNumber=${page}&pageSize=${size}`);
      setProducts(response.data.products);
      setTotalProducts(response.data.totalProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchProducts = async (searchTerm, page, size) => {
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/search?searchTerm=${encodedSearchTerm}&pageNumber=${page}&pageSize=${size}`);
      setProducts(response.data.products);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };
  const handleNextPage = () => {
    setPageNumber(pageNumber + 1)
  }
  const toggleList = () => {
    setIsOpen(!isOpen)
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchChange();
    }
  };
  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Box className={classes.left}>
        <TextField
          className={classes.searchbox}
          label={null}
          placeholder="Find a part..."
          size="small"
          variant="outlined"
          sx={{ width: 250, backgroundColor: '#f7f7f8', marginBottom: '10%' }}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearchChange}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          value={searchTerm}
          fullWidth
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Typography variant="h6" fontWeight="bold" color="textSecondary">
          Popular Manufacturers
        </Typography>
        <Box p={2}>
          <Grid container spacing={3}>
            {buttonGroups.map((group, index) => (
              <Grid item xs={12} key={index}>
                <Grid container spacing={4}>
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#f5d949',
                        color: 'black',
                        minWidth: '100px',
                        fontSize: '12px',
                        marginTop: '5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '&:hover': {
                          backgroundColor: '#113163',
                          color: 'white',
                        }
                      }}
                    >
                      {group.label1}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#f5d949',
                        color: 'black',
                        minWidth: '100px',
                        fontSize: '12px',
                        marginTop: '5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '&:hover': {
                          backgroundColor: '#113163',
                          color: 'white',
                        }
                      }}
                    >
                      {group.label2}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box className={classes.categories}>
          <Box onClick={toggleList}>
            <Typography variant="h6" fontWeight="bold" color="textSecondary" className={classes.parttext}>
              Part Types {isOpen ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
            </Typography>
          </Box>
          {isOpen && (
            <ul style={{ listStyleType: 'none' }}>
              {categories.map(category => (
                <li key={category.categoryId}>
                  <Link href={`/shopByCategory/${category.categoryId}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="body1" color="textSecondary">
                      {category.name}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Box>
      </Box>
      <Box className={classes.right}>
        {/* <TextField
          className={classes.searchboxm}
          label={null}
          placeholder="Find a part..."
          size="small"
          variant="outlined"
          sx={{ width: 250, backgroundColor: '#f7f7f8' }}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearchChange}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          fullWidth
        /> */}
        <Grid container spacing={1}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
              <Box
                className={classes.productc}
                key={index}
              >
                <img src={product.pictureUrl || c1.src} alt="productimg" style={{ width: "50%" }} />
                <Typography variant="h7" fontWeight="bold" component="p">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.shortDescription}
                </Typography>
                <Link href={`/product/${product.productId}`}>
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
                    VIEW PRODUCT
                  </Button>
                </Link>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box style={{ marginTop: "20px", display: "flex", justifyContent: "center", marginTop: "4%", padding: isMobile ? "0 10px" : "0", }}>
          <Pagination
            count={totalPages}
            page={pageNumber}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  fontWeight: item.page === pageNumber ? "bold" : "normal",
                  fontSize: isMobile ? "0.75rem" : "1rem",
                  margin: isMobile ? "0 2px" : "0 4px",
                  padding: isMobile ? "2px 4px" : "4px 8px",
                }}
              />
            )}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 0 : 1}
            showFirstButton={!isMobile}
            showLastButton={!isMobile}
          />
        </Box>
      </Box>
    </>
  )
}

export default MainComponent

