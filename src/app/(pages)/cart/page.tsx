'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Box, Typography, Button, Stepper, Step, StepLabel, TextField, Divider, Link } from '@mui/material'
import { useRouter } from 'next/navigation'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
// import { useMediaQuery } from '@mui/material'; //for vertical stepper on extra small screen
// import { useTheme } from '@mui/material/styles'; //for vertical stepper on extra small screen

const steps = ['Your Cart', 'Checkout', 'Order Complete']

const Cart = () => {
  const [products, setProducts] = useState([])
  const router = useRouter()

  // const theme = useTheme(); //for vertical stepper on extra small screen
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); //for vertical stepper on extra small screen

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
        if (cartItems.length === 0) {
          console.warn('No items in the cart')
          return
        }
        const fetchProductDetails = cartItems.map(item => {
          if (item.productId) {
            return axios.get(
              `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/${item.productId}`
            )
          } else {
            console.error('Product ID is missing:', item)
            return null
          }
        })

        const responses = await Promise.all(fetchProductDetails.filter(Boolean))
        const fetchedProducts = responses.map(response => response.data)
        const updatedProducts = fetchedProducts.map((product, index) => ({
          ...product,
          quantity: cartItems[index]?.quantity || 1,
        }))
        setProducts(updatedProducts)
      } catch (error) {
        console.error('Error fetching cart products:', error)
      }
    }

    fetchCartProducts()
    document.title = "Cart"
  }, [])

  const handleQuantityChange = (id, value) => {
    const newQuantity = parseInt(value, 10);
    if (newQuantity >= 1) {
      updateCartQuantity(id, newQuantity);
    }
  };

  const handleStepClick = index => {
    const urls = [
      `/cart`,
      `/checkout`,
      `/order-received`,
    ]
    router.push(urls[index])
  }

  const updateCartQuantity = (id, newQuantity) => {
    const updatedCartItems = [...products];
    const existingProductIndex = updatedCartItems.findIndex(item => item.productId === id);
    if (existingProductIndex >= 0) {
      updatedCartItems[existingProductIndex].quantity = newQuantity;
    }
    try {
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error saving cart items to local storage:', e);
    }
    setProducts(updatedCartItems);
  };

  const subtotal = products.reduce(
    (total, product) => total + product.price * (product.quantity || 1), 0
  )

  return (
    <>
    <div className="content-container">
      <Box
          sx={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#113163',
            padding: '10px 20px',
            height: '6rem',
            '@media (min-width: 1300px)': {
              left: '50%',
              right: '50%',
              marginLeft: '-50vw',
              marginRight: '-50vw',
              width: '99.3vw',
            },
          }}
        >
          <Box
            sx={{
              maxWidth: '1350px', 
              margin: '0 auto', 
              width: '100%', 
              display: 'flex',
              flexDirection: 'column',
            }}
          >
        <Box
          sx={{
            marginLeft: '2rem',
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', flexGrow: 1, fontSize: '1.8rem' }}>
           Cart
          </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '20rem', 
              // justifyContent: 'flex-end'
              }}>
              <Link href="/">
                <Button
                  variant="text"
                  sx={{
                    textTransform: 'none',
                    color: '#d1d5db', 
                    fontSize: '0.75rem',
                    mr: '-15px',
                    // mb: '2px',
                    '&:hover': {
                      color: 'white', 
                    },
                  }}
                >
                  Home
                </Button>
              </Link>
              <Typography variant="body1" sx={{ color: '#d1d5db', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <ArrowRightIcon fontSize="small" />
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  // whiteSpace: 'nowrap',
                  // overflow: 'hidden',
                  // textOverflow: 'ellipsis',
                  // mt: '3px', 
                  fontSize: '0.75rem',
                  p: 0,
                  // '&:hover': {
                  //   color: 'white', 
                  // },
                }}
              >
                Cart
              </Typography>
            </Box>
        </Box>
      </Box>
      </Box>

      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: {
            xs: 'column',         
            sm: 'column',         
            md: 'row',   
            '@media (min-width:900px) and (max-width:970px)': {
              flexDirection: 'column',
            },
          },
          gap: '16px',
        }}
      >
      <Box sx={{ flex: 1, marginRight: { md: '16px' } }}>
        <Stepper
          activeStep={0}
          // alternativeLabel={!isSmallScreen}
          // orientation={isSmallScreen ? 'vertical' : 'horizontal'} //for vertical stepper on extra small screen
          alternativeLabel
          sx={{
            width: '100%',
            maxWidth: '100vw',
            marginLeft: { xs: '0', md: '30%' },
            marginBottom: '16px',
            '@media (min-width: 900px) and (max-width: 970px)': {
              marginLeft: '0',
            }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} onClick={() => handleStepClick(index)}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          sx={{
            marginTop: '60px',
            backgroundColor: '#f5f5f5',
            padding: '5px',
            paddingRight: '20px',
            borderRadius: '8px',
          }}
        >
          {products.length === 0 ? (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                marginTop: '16px',
                padding: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                textAlign: 'center',
              }}
            >
              No products have been added to the cart.
            </Typography>
          ) : (
            <>
              <Box
                sx={{
                  display: { xs: 'none', sm: 'grid' },
                  gridTemplateColumns: {
                    sm: '0.9fr 1.8fr 0.10fr 0.4fr 0.6fr',
                  },
                  alignItems: 'center',
                  gap: '20px',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '8px',
                  marginBottom: '16px',
                }}
              >
                <Typography></Typography>
                <Typography>Product</Typography>
                <Typography sx={{ textAlign: 'right' }}>Price</Typography>
                <Typography sx={{ textAlign: 'right' }}>Quantity</Typography>
                <Typography>Subtotal</Typography>
              </Box>

              {products.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    marginBottom: '16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr', // Stack product details on extra small screens
                        sm: '0.2fr 1.8fr 0.4fr 0.4fr 0.6fr',
                      },
                      alignItems: 'center',
                      gap: '20px',
                      textAlign: { xs: 'center', sm: 'left' },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={
                          product.pictureUrl ||
                          'https://www.microchipusa.com/wp-content/uploads/2023/07/LT6231CDD_TRPBF.jpg'
                        }
                        alt={product.name}
                        style={{
                          maxWidth: '100px',
                          minWidth: '30px',
                          width: '100%',
                          borderRadius: '8px',
                          filter:
                            'sepia() hue-rotate(180deg) saturate(140%) brightness(90%) contrast(128%)',
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body1" fontWeight="bold" color="black">
                        {product.name}
                      </Typography>
                    </Box>

                    {/* Hide price on extra small screens */}
                    <Box
                      sx={{
                        textAlign: 'right',
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold" color="black">
                        ${product.price.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        // textAlign: 'right',
                        display: 'flex',
                        // justifyContent: 'flex-end',
                        justifyContent:{
                        xs: 'center',         
                        sm: 'flex-end',         
                        md: 'flex-end',
                        }
                      }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.productId, e.target.value)
                        }
                        inputProps={{ min: 1 }}
                        sx={{ width: '90px' }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body1" fontWeight="bold" color="black">
                        ${(product.price * (product.quantity || 1)).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginBottom: '16px',
          marginTop: { xs: '16px', md: '125px' },
          flex: 1,
          backgroundColor: '#f5f5f5',
          maxWidth: { xs: '100%', md: '400px' },
          width: '100%',
          height: '300px',
          maxHeight: 'calc(100vh - 20px)',
          overflowY: 'auto',
          '@media (min-width: 900px) and (max-width: 970px)': {
            maxWidth: '100%', 
            marginTop: '16px'
          }
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: '16px' }}>
          Cart Totals
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px' }}>
          Subtotal: ${subtotal.toFixed(2)}
        </Typography>
        <Divider sx={{ borderBottomWidth: 2, backgroundColor: 'black', marginY: 2 }} />
        <Typography variant="h5" sx={{ marginBottom: '8px' }}>
          Total: ${subtotal.toFixed(2)}
        </Typography>
        <Box sx={{ marginTop: 'auto', width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: '#29499f',
              color: 'white',
              width: '100%',
              '&:hover': {
                backgroundColor: '#29499f',
              },
            }}
            onClick={() => router.push('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Box>
    </div>
    </>
  )
}

export default Cart
