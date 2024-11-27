import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, Button } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import classes from './index.module.scss'; 
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link } from '@mui/material'
import image4 from './Home_images/image4.jpg'

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={classes.arrowContainerLeft}>
      <button className={classes.slickPrev} onClick={onClick}>
        <ChevronLeft className={classes.iconPrev}/>
      </button>
    </div>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={classes.arrowContainerRight}>
      <button className={classes.slickNext} onClick={onClick}>
        <ChevronRight className={classes.iconNext} />
      </button>
    </div>
  );
};


const FeaturedProductSlider = ({ items }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  let slidesToShow;
  if (isSmallScreen) {
    slidesToShow = 1;
  } else if (isMediumScreen) {
    slidesToShow = 2;
  } else {
    slidesToShow = 4;
  }

  const settings = {
    slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    infinite: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: slidesToShow,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="content-container">
      <Box className={classes.productSliderContainer}>        
        <Typography variant="h4" className={classes.productSliderHeading}>
          FEATURED PRODUCTS
        </Typography>
        <Slider {...settings} className={classes.slider} 
        style={{ width: '100%', margin: '0 auto' }}>
          {items.map((item, index) => (
            <Link href={`/products/${item.manufacturerSlug}/${item.categorySlug}/${item.sku}`} underline='none'>
            <Box key={index} className={classes.sliderItem}>
              <Box className={classes.item}>
                <img 
                  src={item.img || "https://www.microchipusa.com/wp-content/uploads/2023/07/LT6231CDD_TRPBF.jpg"} 
                  alt={item.title} 
                  className={`${classes.product} ${classes.imageHover}`} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = image4.src;
                  }}
                />
                <div className={classes.itemText} style={{ textDecoration: 'none',color:'black' }}>
                  <Typography variant="h6" className={classes.itemTitle}>{item.title}</Typography>
                  <Typography variant="body1" className={classes.itemSubheading}>{item.subHeading}</Typography>
                  <Typography variant="body2" className={classes.itemBody}>{item.description}</Typography>
                  <Button variant="contained" color="primary" className={classes.itemBtn}>
                    REQUEST QUOTE
                  </Button>
                </div>
              </Box>
            </Box>
            </Link>
          ))}
        </Slider>
      </Box>
    </div>
  );
};

export default FeaturedProductSlider;
