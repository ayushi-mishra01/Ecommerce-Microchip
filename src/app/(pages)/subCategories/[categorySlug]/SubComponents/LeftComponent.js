'use client'
import classes from './index.module.scss'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link, Typography } from '@mui/material'
import { Button, Grid, Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const buttonGroups = [
  { label1: 'INTEL', label2: 'ALTERA' },
  { label1: 'AMD', label2: 'XILINX' },
  { label1: 'NXP', label2: 'ANALOG DEVICES' },
  { label1: 'TI', label2: 'STMICRO' },
]
const LeftComponent = ({categoryId}) => {
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(true)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories`);
        const filteredCategories = response.data.filter(category => category.parentCategoryId === categoryId );
        const sortedCategories = filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleList = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <TextField
        className={classes.searchbox}
        label={null}
        placeholder="Find a part..."
        size="small"
        variant="outlined"
        sx={{ backgroundColor: '#f7f7f8' }}
        InputProps={{
          endAdornment: (
            <IconButton>
              <SearchIcon />
            </IconButton>
          ),
        }}
        fullWidth
      />
      {/* <Typography variant="h6" fontWeight="bold" color="textSecondary">
        Popular Manufacturers
      </Typography>
      <Box p={2}>
        <Grid container spacing={3}>
          {buttonGroups.map((group, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={4}>
                <Grid item>
                  <Button
                    className={classes.button}
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
                    }}
                  >
                    {group.label1}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.button}
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
                    }}
                  >
                    {group.label2}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box> */}
      <Box className={classes.categories}>
        <Box onClick={toggleList}>
          <Typography variant="h6" fontWeight="bold" color="textSecondary" className={classes.parttext}>
            Sub Categories {isOpen ? <KeyboardArrowUpOutlinedIcon />: <KeyboardArrowDownOutlinedIcon />}
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
    </>
  )
}

export default LeftComponent
