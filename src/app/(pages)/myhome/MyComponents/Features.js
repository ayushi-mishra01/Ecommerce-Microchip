import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import classes from './index.module.scss';

const Section = ({ icon: Icon, heading, text }) => (
  <Grid item xs={12} sm={6} md={3} className={classes.section}>
    <Box className={classes.iconContainer}>
      <Icon className={classes.icon} />
    </Box>
    <Typography variant="h6" className={classes.heading}>
      {heading}
    </Typography>
    <Typography variant="body2" className={classes.text}>
      {text}
    </Typography>
  </Grid>
);

const Features = ({sectionData}) => {
  return (
    <div style={{backgroundColor: '#F7F7F8' }} >
      <div className="content-container">
        <Grid container className={classes.sectionsContainer}>
          {sectionData.map((section, index) => (
            <Section
              key={index}
              icon={section.icon}
              heading={section.heading}
              text={section.text}
            />
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Features;
