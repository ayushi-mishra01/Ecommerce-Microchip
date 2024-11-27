import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import classes from './index.module.scss';
import { Link } from '@mui/material'
import image18 from './Home_images/image18.png'

const CustomBox = ({ title, image, items, slug, is }) => (
  <Box
    border={1}
    borderRadius={1}
    padding={2}
    borderColor="grey.300"
    marginBottom={2}
    display="flex"
    justifyContent="space-between"
    alignItems="flex-start"
    sx={{
      height: 'auto',
      transition: 'transform 0.3s, box-shadow 0.3s', 
      '&:hover': {
        // transform: 'scale(1.05)',
        transform: 'scale(1.0)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
      },
    }}
  >
    <Box>
      <Box className={classes.catTitle}>
        <Link href={is ? `/subCategories/${slug}` : `/category/${slug}`} underline='none' color="black">
          <Typography variant="body1" color="#666965" marginBottom={1} sx={{ textDecoration: 'underline', fontWeight: 'bold', width: '95%' }}>
            {title}
          </Typography>
        </Link>
      </Box>
      {items.map((item, index) => (
        // <Box sx={{ transition: 'transform 0.3s, box-shadow 0.3s', 
        //   '&:hover': {
        //     // transform: 'scale(1.05)',
        //     transform: 'scale(1.05)',
        //     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
        //   }}}>
        <Link href={item.hasSubcategories? `/subCategories/${item.slug}` : `/category/${item.slug}`} underline='none' color="black">
          <Typography variant="body2" color="textSecondary" key={index} sx={{ ml: 1, textDecoration: 'underline' }}>
            {item.name}
          </Typography>
        </Link>
        //</Box>
      ))}
    </Box>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      // marginLeft={4}
      sx={{ height: '85px', width: '85px' }}
    >
      <img 
        src={image}
        alt={title} 
        style={{ height: '70%' }}
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = image18.src;
        }}
      /> 
    </Box>
  </Box>
);

const ColumnLayout = ({ boxesData }) => {
  const columns = [[], [], [], []];

  boxesData.forEach((box, index) => {
    const columnIndex = index % 4;
    columns[columnIndex].push(
      <CustomBox
        key={index}
        title={box.title}
        image={box.image}
        items={box.items}
        slug={box.slug}
        is={box.is}
      />
    );
  });

  return (
    <Box className={classes.catContainer}>
      <Typography variant="h4" gutterBottom textAlign="center" marginTop={4}>
        Product Categories
      </Typography>
      <Grid container spacing={2}>
        {columns.map((column, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            {column}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ColumnLayout;
