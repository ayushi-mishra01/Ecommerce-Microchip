import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, useTheme, useMediaQuery, Link } from '@mui/material';
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classes from './index.module.scss'; 

const Services = ({ourServices}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: 1,
    arrows: !isMobile 
  };

  return (
    <Box className={classes.servicesContainer}>
      <div className="content-container">
      <Typography variant="h4" className={classes.servicesHeading}>
        Our Services
      </Typography>
      {isMobile ? (
        <Slider {...settings}>
          {ourServices.map((card, index) => (
            <Box key={index} sx={{ width: '100%', padding: theme.spacing(1) }}>
              <Card sx={{ width: '100%', backgroundColor: '#f7f7f8', boxShadow: 'none', borderRadius: '0px' }}>
                <CardMedia
                  style={{ height: 270 }}
                  image={card.img}
                  title={card.title}
                />
                <CardContent sx={{ ml: '-14px' }}>
                  <Link href={card.slug} className={classes.titleClasses}><Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {card.title}
                    </Typography>
                  </Link>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {card.description}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <Box
                      sx={{
                        width: 4,
                        height: 18,
                        backgroundColor: '#f5d949',
                        marginRight: 0.5,
                      }}
                    />
                    <Link href={`/${card.slug}`} >
                      <Button className={classes.learnBtn}>
                        LEARN MORE
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      ) : (
        <Grid container spacing={1} style={{ padding: theme.spacing(4), paddingLeft: '60px' }}>
          {ourServices.map((card, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card sx={{ width: '90%', maxWidth: 300, backgroundColor: '#f7f7f8', boxShadow: 'none', borderRadius: '0px' }}>
                <CardMedia
                  style={{ height: 270 }}
                  image={card.img}
                  title={card.title}
                  className={classes.serviceImg}
                />
                <CardContent sx={{ ml: '-14px' }}>
                  <Link href={card.slug} className={classes.titleClasses}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }} className={classes.titleClasses}>
                      {card.title}
                    </Typography>
                  </Link>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {card.description}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <Box
                      sx={{
                        width: 4,
                        height: 18,
                        backgroundColor: '#f5d949',
                        marginRight: 0.5,
                      }}
                    />
                    <Link href={`/${card.slug}`} >
                      <Button className={classes.learnBtn}>
                        LEARN MORE
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      </div>
    </Box>
  );
};

export default Services;
