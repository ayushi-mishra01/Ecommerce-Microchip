import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import classes from './index.module.scss';
import Link from 'next/link';

const TopSlider = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const nextSlide = () => {
    if (animating) return; 
    setAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    if (animating) return; 
    setAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); 
    return () => clearInterval(interval); 
  }, []);

  const handleAnimationEnd = () => {
    setAnimating(false);
  };

  return (
    <Grid container className={classes.sliderContainer}>
      <div className="content-container">
      <Grid item>
        <ChevronLeftIcon className={`${classes.navIcon} ${classes.leftIcon}`} onClick={prevSlide} />
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.card}>
          <Grid container 
              className={`${classes.cardContent} ${animating ? classes.slideEnter : ''}`}
              onAnimationEnd={handleAnimationEnd}
              style={{ height: '100%' }} 
              >
            <Grid item xs={12} md={7} className={classes.cardText}>
              <div className={classes.textSection}>
                <Typography variant="h4" className={classes.sliderHeading}>
                  {cards[currentIndex].title}
                  <span className={classes.titleLine}></span> 
                </Typography>
                <Typography variant="body1" className={classes.sliderBody}>{cards[currentIndex].description}</Typography>
                <Button variant="contained" color="primary" className={classes.learnMoreBtn}>
                <a href={cards[currentIndex].slug} className="linkStyled"> LEARN MORE</a>
                </Button>
              </div>
            </Grid>
            <Grid item xs={12} md={5}>
              <div className={`${classes.imageSection} ${animating ? classes.imageAnimate : ''}`}>
                <Box component="img" src={cards[currentIndex].image} alt="Image" className={classes.cardImage} />
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <ChevronRightIcon className={`${classes.navIcon} ${classes.rightIcon}`} onClick={nextSlide} />
      </Grid>
      </div>
    </Grid>
  );
};

export default TopSlider;
