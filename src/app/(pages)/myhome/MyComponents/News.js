import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import FeaturedArticle from './FeaturedArticle';
import classes from './index.module.scss'; 
// import Link from 'next/link';

const News = ({newsItems}) => {

  return (
    <Box className={classes.newsContainer}>
      <div className="content-container">
      <Typography variant="h4" className={`${classes.newsHeading} ${classes.next}`}>
        Recent News and Events
      </Typography>
      <Grid container spacing={2} marginTop={2} paddingLeft={2}>
        <Grid item xs={12} md={8}>
          <Box className={classes.newsMainSection} padding={2}>
            {newsItems.map((item, index) => (
              <Box key={index} display="flex" marginBottom={2} className={classes.newsItem}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  className={classes.newsImg}
                  marginRight={2}
                />
                <Box sx={{ mt: 3 }}>
                  <Link href={item.url} className={classes.titleClasses}><Typography variant="h6" sx={{ mb: 2 }} >{item.title}</Typography></Link>
                  <Typography variant="body2" sx={{ mb: 2 }} className={classes.newsDateSource}>
                    <span className={classes.newsDate}>{item.date}</span> <span className={classes.hyphon}>- </span><span className={classes.newsSource}>{item.source}</span>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className={classes.newsBody}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={3.5} sx={{mt:2, ml:1}}>
          <Box className={classes.newsSidebarSection} padding={4} sx={{backgroundColor:'#f0f0f0'}}>
            <FeaturedArticle /> 
          </Box>
        </Grid>
      </Grid>
      </div>
    </Box>
  );
};

export default News;
