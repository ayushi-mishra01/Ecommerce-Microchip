import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Box, Typography, Button, Link } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useMediaQuery } from 'react-responsive';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image13 from './Home_images/image13.png';
import image14 from './Home_images/image14.png';
import image15 from './Home_images/image15.png';
import component from './Home_images/component1.jpg';
import classes from './index.module.scss'; 

const slides = [
  {
    image: image14.src,
    title: 'NXP Integrated Circuits (ICs)',
    url: 'articles/nxp-integrated-circuits-ics',
    text: `Integrated Circuits (ICs) form the foundation of modern electronics, enabling complex functionality in compact packages. NXP, a pioneer in semiconductor technology, has a rich history of delivering high-performance ICs that power a wide range of applications across industries. With their commitment to innovation, reliability, and sustainability, NXP ICs continue to shape the technology landscape. Product…`,
  },
  {
    image: image15.src,
    url: 'articles/cplds',
    title: 'CPLDs',
    text: `In the ever-evolving landscape of digital electronics, programmable logic devices (PLDs) have emerged as indispensable tools for implementing intricate logic functions and digital circuits. Among these versatile devices, Complex Programmable Logic Devices (CPLDs) stand out, providing a flexible and powerful solution for designing and prototyping digital systems. What is a CPLD? Complex Programmable Logic Devices…`,
  },
  {
    image: component.src,
    url: 'articles/component-types',
    title: 'Component Types',
    text: `Electronic components are the fundamental building blocks that form the backbone of modern technology. From the simplest electronic devices to the most complex systems, these components enable the creation of electronic circuits, facilitating the flow, control, and processing of electrical signals. They are the essence of innovation, empowering advancements in communication, computing, automation, energy management,…`,
  },
];

const NewsSlider = () => {
  const sliderRef = useRef(null);

  const isMediumScreen = useMediaQuery({ query: '(max-width: 899px)' });
  const isSmallScreen = useMediaQuery({ query: '(max-width: 600px)' });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isSmallScreen ? 1 : isMediumScreen ? 2 : 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const goToPrev = () => sliderRef.current.slickPrev();
  const goToNext = () => sliderRef.current.slickNext();

  return (
    <Box position="relative" width="100%" maxWidth="800px" margin="auto" height="auto" className={classes.articleSlider}>
      <Typography variant="h6" sx={{ mb: 1, color: 'rgb(165, 159, 159)' }} className={classes.articleHeading}>
        Featured Articles
      </Typography>
      <Slider {...settings} ref={sliderRef} className={classes.newsSlider}>
        {slides.map((slide, index) => (
          <Box key={index} display="flex" flexDirection="column" alignItems="flex-start" textAlign="left"
          className={classes.innerPart}>
            <Box component="img" src={slide.image} alt={slide.title} width="100%" height="auto" sx={{ mb: 2 }} className={classes.articleImg} />
            <Link href={slide.url} className={classes.titleClasses}>
              <Typography variant="h6" sx={{ mb: 1 }} className={classes.titleClasses}>
                {slide.title}
              </Typography>
            </Link>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              {slide.text}
            </Typography>
            <Link href={slide.url} className={classes.titleClasses}>
            <Box display="flex" alignItems="center" mt={2}>
              <Box
                sx={{
                  width: 4,
                  height: 18,
                  backgroundColor: '#f5d949',
                  marginRight: 0.5,
                }}
              />
                <Button className={classes.learnBtn}>READ ARTICLE</Button>
            </Box>  
            </Link>         
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
  );
};

export default NewsSlider;
