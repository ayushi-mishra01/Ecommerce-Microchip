'use client'
import classes from './index.module.scss'
import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import { Typography, Link } from '@mui/material'
import Grid from '@mui/material/Grid'
import card1 from './assets/arria-10.png'
import card2 from './assets/card2.png'
import card3 from './assets/card3.png'
import card4 from './assets/card4.png'
const cardsData =
  [
    {
      img: card1,
      url: '/articles/arria-10',
      name: 'Arria 10',
      manufacturer: 'Intel / Altera, Product',
      description: 'The Arria 10 is an advanced system-on-chip (SoC) FPGA family designed and developed by Intel'
    },
    {
      img: card2,
      url: '/articles/max-10',
      name: 'Max 10',
      manufacturer: 'Intel / Altera',
      description: 'Introduction to MAX10 FPGA The MAX10 FPGA is a high-performance, low-cost FPGA developed by Altera'
    },
    {
      img: card3,
      url: '/articles/cyclone',
      name: 'Cyclone',
      manufacturer: 'Intel / Altera',
      description: 'Cyclone FPGAs, developed by Intel, are a family of programmable logic devices known for their versatility'
    },
    {
      img: card4,
      url: '/articles/stratix',
      name: 'Stratix',
      manufacturer: 'Intel / Altera',
      description: 'Among the leading FPGA families available in the market, Stratix FPGAs, developed by Intel developed by Intel'
    }
  ];

const Cards = () => {
  return (
    <>
      <Grid container spacing={5} className={classes.cardsdata}>
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ backgroundColor: '#f7f7f8' }}>
            <Link href={card.url} className={classes.titleClasses}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={card.img.src}
                  title="card1"
                  className={classes.hoverEffect}
                />
              </Link>
              <CardContent>
              <Link href={card.url} className={classes.titleClasses}>
                  <Typography gutterBottom variant="h7" component="div" sx={{color:'black'}}>
                    {card.name}
                  </Typography>
                  <Typography variant="h7" color="text.secondary" fontWeight="bold">
                    {card.manufacturer}
                  </Typography>
                </Link>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions>
              <Link href={card.url} className={classes.titleClasses}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f5d949',
                    color: 'black',
                    width: '120px',
                    fontSize: '12px',
                    '&:hover': {
                          backgroundColor: '#113163',
                          color: 'white',
                        }
                  }}
                >
                  Read More
                </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Cards
