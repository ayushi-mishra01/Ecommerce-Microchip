'use client'
import classes from './index.module.scss'
import * as React from 'react'
import Button from '@mui/material/Button'
import { Link, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import news1 from './assets/news1.png'
import news2 from './assets/news2.png'
import news3 from './assets/news3.jpg'
import art1 from './assets/art1.png'
import art2 from './assets/art2.png'
import art3 from './assets/art3.png'

const BottomComponent = () => {
  return (
    <>
      <Box className={classes.articles}>
        <Box className={classes.newslink}>
          <Typography variant="h5" fontWeight="bold" sx={{color:'#254291',marginLeft:'4%',marginTop:'2%',marginBottom:'3%'}}>
            Industry News
          </Typography>
          <Box className={classes.elink}>
            <Link href="/industry-news/overcoming-electronic-component-supply-chain-obstacles" underline="none" color="black" >
              <Box sx={{ display: 'flex' }}>
                <img
                  src={news1.src}
                  alt="Link image"
                  style={{
                    width: 'auto',
                    height: '50px',
                    marginRight: '2%',
                    marginTop: '2%'
                  }}
                />
                <Box className={classes.news}>
                  <Typography variant="h7">
                    Overcoming Electronic Component Supply Chain Obstacles
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Industry news July 15, 2024
                  </Typography>
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
                </Box>
              </Box>
            </Link>
          </Box>
          <Box className={classes.elink}>
            <Link href="/industry-news/managing-excess-inventory-amid-microchip-supply-chain-disruptions" underline="none" color="black" >
              <Box sx={{ display: 'flex' }}>
                <img
                  src={news2.src}
                  alt="Link image"
                  style={{
                    width: 'auto',
                    height: '50px',
                    marginRight: '2%',
                    marginTop: '2%'
                  }}
                />
                <Box className={classes.news}>
                  <Typography variant="h7">
                    Managing Excess Inventory Amid Supply Chain Disruptions
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Semiconductor Industry July 12, 2024
                  </Typography>
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
                </Box>
              </Box>
            </Link>
          </Box>
          <Box className={classes.elink}>
            <Link href="/industry-news/earthquake-strikes-taiwan-causing-supply-chain-disruptions" underline="none" color="black" >
              <Box sx={{ display: 'flex' }}>
                <img
                  src={news3.src}
                  alt="Link image"
                  style={{
                    width: 'auto',
                    height: '50px',
                    marginRight: '2%',
                    marginTop: '2%'
                  }}
                />
                <Box className={classes.news}>
                  <Typography variant="h7">
                    Earthquake Strikes Taiwan Causing Supply Chain Disruptions
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Industry news July 9, 2024
                  </Typography>
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
                </Box>
              </Box>
            </Link>
          </Box>
        </Box>
        <Box className={classes.articleslink}>
          <Typography variant="h5" fontWeight="bold" sx={{color:'#254291',marginLeft:'4%',marginTop:'2%',marginBottom:'3%'}}>
            Component Articles
          </Typography>
          <Box className={classes.elink}>
            <Link href="/articles/what-is-a-fpga-board" underline="none" color="black" >
              <Box sx={{ display: 'flex' }}>
                <img
                  src={art1.src}
                  alt="Link image"
                  style={{
                    width: 'auto',
                    height: '50px',
                    marginRight: '2%',
                    marginTop: '2%'
                  }}
                />
                <Box className={classes.news}>
                  <Typography variant="h7">What is a FPGA Board?</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Electrical Components March 22, 2024
                  </Typography>
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
                </Box>
              </Box>
            </Link>
          </Box>
          <Box className={classes.elink}>
            <Link href="/articles/digital-signal-processors-dsps" underline="none" color="black" >
              <Box sx={{ display: 'flex' }}>
                <img
                  src={art2.src}
                  alt="Link image"
                  style={{
                    width: 'auto',
                    height: '50px',
                    marginRight: '2%',
                    marginTop: '2%'
                  }}
                />
                <Box className={classes.news}>
                  <Typography variant="h7">Digital Signal Processors (DSPs)</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Electrical Components September 7, 2023
                  </Typography>
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
                </Box>
              </Box>
            </Link>
          </Box>
          <Box className={classes.elink}>
            <Link href="/articles/the-ultimate-guide-to-capacitors-everything-you-need-to-know" underline="none" color="black" >
              <Box sx={{ display: 'flex' }}>
                <img
                  src={art3.src}
                  alt="Link image"
                  style={{
                    width: '95px',
                    height: '50px',
                    marginRight: '2%',
                    marginTop: '2%'
                  }}
                />
                <Box className={classes.news}>
                  <Typography variant="h7">
                    The Ultimate Guide to Capacitors: Everything You Need to Know
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Electrical Components April 12, 2023
                  </Typography>
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
                </Box>
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default BottomComponent
