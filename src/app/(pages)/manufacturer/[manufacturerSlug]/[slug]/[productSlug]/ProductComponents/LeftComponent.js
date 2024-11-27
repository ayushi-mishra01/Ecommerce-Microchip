'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import classes from './index.module.scss'
import * as React from 'react'
import Button from '@mui/material/Button'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Grid, Link, Typography } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import banner from './assets/Certification-Banner-2.png'
import c1 from './assets/c1.jpg'
import icon from './assets/icon.svg'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import TableRow from '@mui/material/TableRow'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField';
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useRouter } from 'next/navigation';
import {loadPartDiv} from './loadPartDiv';

function createData(title, value) {
  return { title, value }
}
const rows = [
  createData('Packaging', 'Tray'),
  createData('Package / Case', '1932-BBGA, FCBGA'),
  createData('Mounting Type', 'Surface Mount'),
  createData('Operating Temperature', '0°C ~ 100°C (TJ)'),
  createData('Voltage - Supply', '  0.87V ~ 0.93V'),
  createData('Number of Logic Elements/Cells', '1150000'),
  createData('Supplier Device Package', '1932-FBGA, FC (45x45)'),
  createData('Number of LABs/CLBs', '427200'),
  createData('Total RAM Bits', '68857856'),
  createData('Part Status', 'Active'),
  createData('Number of I/O', '624'),
  createData('Programmable', 'Not Verified'),
]
const LeftComponent = ({ id ,data, parameters, mnanufacturerSlug, categorySlug}) => {
  // const [data, setData] = useState(null)
  // const [parameters, setParameters] = useState(null)
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [cadDialogOpen, setCadDialogOpen] = useState(false)
  const [cadDialogOpen1, setCadDialogOpen1] = useState(false)
  const [cadContent, setCadContent] = useState('initial')
  const [manufacturer, setManufacturer] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const router = useRouter();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCartItems = localStorage.getItem('cartItems')
      return savedCartItems ? JSON.parse(savedCartItems) : []
    } catch (e) {
      // Handle error or invalid JSON
      console.error('Error parsing cart items from local storage:', e)
      return []
    }
  })

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  const handleDecrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1))
  }

  const handleViewCart = () => {
    router.push('/cart'); // Redirect to the cart page
  };


  // const handleAddToCart = () => {
  //   setDialogOpen(true)
  //   console.log(quantity) // Log the quantity value
  //   // Add additional logic for adding to cart here
  // }

  const handleAddToCart = () => {
    const updatedCartItems = [...cartItems];
    const existingProductIndex = updatedCartItems.findIndex(item => item.productId === id);
    if (existingProductIndex >= 0) {
      updatedCartItems[existingProductIndex].quantity = quantity;
    } else {
      updatedCartItems.push({ productId: id, name: data.name, quantity, price: data.price, pictureUrl: data.pictureUrl });
    }

    // Save updated cart items to localStorage
    try {
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error saving cart items to local storage:', e);
    }

    // Update local state
    setCartItems(updatedCartItems);
    setDialogOpen(true);
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleQuantityChange = (event) => {
    const value = Math.max(Number(event.target.value), 1)
    setQuantity(value)
  }
  const handleOpenCadDialog = () => {
    setCadDialogOpen(true)
  }
  const handleOpenCadDialog1 = () => {
    setCadContent('second')
  }

  const handleback = () => {
    setCadContent('initial')
  }

  const handleCloseCadDialog = () => {
    setCadDialogOpen(false)
  }
  // const handleCloseCadDialog1 = () => {
  //   setCadDialogOpen1(false)
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/${id}`,
        )
      //  console.log('response1: ', response1)
        setManufacturer(response1.data.manufacturerName);
        setPartNumber(response1.data.name)
      
        const num=response1.data.name;
        localStorage.setItem('numKey', JSON.stringify(num));

        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/GetParametersByProduct/${id}`,
        )
        // document.title=response1.data.name
        // console.log("data from product.tsx: ", data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [id])
  // if (loading) return <p>Loading...</p>
  // if (error) return <p>{error}</p>
  return (
    <>
      <Box
        component="img"
        src="https://www.microchipusa.com/wp-content/uploads/2024/02/Certification-Banner-2.png"
        alt="Banner"
        className={classes.banner}
      />
      <Box className={classes.productbox}>
        <Box
          component="img"
          src={data.pictureUrl || c1.src}
          alt="productimage"
          className={classes.productimg}
        />
        <Box className={classes.productcontent}>
          <Typography
            variant="h4"
            color="black"
            fontWeight="bold"
            className={classes.productcat}
            sx={{ marginBottom: '2%' }}
          >
            {data.name}
          </Typography>
          <Typography variant="h7" color="text.secondary" className={classes.productic}>
            {data.shortDescription.replace(/"/g, '')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className={classes.productcat}
            sx={{ marginTop: '1%' }}
          >
            Manufacturer:{' '}
            <Link href={`/manufacturer/${mnanufacturerSlug}`} color="primary">
              {data.manufacturerName}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" className={classes.productcat}>
            Categories:{' '}
            <Link href={`/category/${categorySlug}`} color="primary">
              {data.categoryName}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" className={classes.productic}>
            Quality Control:{' '}
            <Link href={`/quality-control`} color="primary">
              Learn More
            </Link>
          </Typography>
          {(data.inventoryTypeId == 2 && data.stockQuantity > 0) ? <Box className={classes.price}>
            <Typography variant="h7" className={classes.productic}>
              ${data.price}
            </Typography>
            <Typography variant="body2" color="text.secondary" className={classes.productic}>
              {data.stockQuantity} Available
            </Typography>
          </Box> : null}
          {(data.inventoryTypeId == 2 && data.stockQuantity > 0) ? <Box display="flex" alignItems="center" mt={3}>
            <TextField
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              InputProps={{
                inputProps: { min: 1 }
              }}
              size='small'
              sx={{ width: '80px', marginRight: '10px', }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#f5d949',
                color: 'black',
                width: '150px',
                fontSize: '12px',
                marginLeft: '5px',
                '&:hover': {
                          backgroundColor: '#113163',
                          color: 'white',
                        }
              }}
              onClick={handleAddToCart}
            >
              <br></br>
              <ShoppingBasketIcon sx={{ marginRight: '6px' }} />
              ADD TO CART
            </Button>
          </Box> : null }
        </Box>
      </Box>

      <Box className={classes.productdesc}>
        <Typography variant="h7" color="text.secondary">
          {data.description}
        </Typography>
      </Box>
      <Box className={classes.addinf}>
        <Typography variant="h4" fontWeight="bold" color="black" className={classes.addhead}>
          Additional Information
        </Typography>
        <Typography variant="h7" color="text.secondary" className={classes.addi}>
          <span style={{ fontWeight: 'bold' }}>Series:</span> {data.series}
        </Typography>
        <Typography variant="h7" color="text.secondary" className={classes.addi}>
          <span style={{ fontWeight: 'bold' }}>RoHS Status:</span> {data.rohsStatus}
        </Typography>
        <Typography variant="h7" color="text.secondary" className={classes.addi}>
          <span style={{ fontWeight: 'bold' }}>Manufacturer Lead Time:</span>{' '}
          {data.manufacturerLeadTime}
        </Typography>
        <Typography variant="h7" color="text.secondary" className={classes.addi}>
          <span style={{ fontWeight: 'bold' }}>Product Status:</span> {data.productStatus}
        </Typography>
        <Typography variant="h7" color="text.secondary" className={classes.addi}>
          <span style={{ fontWeight: 'bold' }}>Packaging:</span> {data.packaging}
        </Typography>
        <Typography variant="h7" fontWeight="bold" color="text.secondary" className={classes.addi}>
          Datasheet:
          <IconButton
            href={data.datasheetPdfurl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="datasheet"
          >
            <PictureAsPdfIcon color="error" />
          </IconButton>
        </Typography>
        <br />
      </Box>
      <Box className={classes.cadlink}>
        <Typography variant="h7" fontWeight="bold" color="text.secondary" className={classes.addi}>
          Download Free CAD Model:
        </Typography>
        <a href="#" onClick={() => loadPartDiv(manufacturer, partNumber, 'microchipusa', 1, 'zip', 0, '', 'en-GB', 1, '', 0)}>
          <img
            src="https://microchipusa.componentsearchengine.com/icon.php?mna=*%20Other%20*&mpn=L77SDEH09SOL2&lbl=1&lbc=000000&q3=1" 
            alt="Link image"
            style={{ width: '30vb', height: 'auto' }}
            className={classes.cadmodel}
          />
        </a>
      </Box>
      <Box className={classes.datatable}>
        <Typography variant="h7" fontWeight="bold" color="text.secondary" className={classes.addi}>
          Technical Details:
        </Typography>
        <hr sx={{ color: 'text.secondary' }} />
        <Table size="small" aria-label="a dense table">
          <TableBody>
            {parameters.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left" sx={{ color: 'text.secondary' }}>
                  {row.parameterName}
                </TableCell>
                <TableCell align="left" sx={{ color: 'text.secondary' }}>
                  {row.parameterValue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="span">
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          Product Added
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">{data?.name} has been added to your cart</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleViewCart} color="primary">
          View Cart
        </Button>
        <Button onClick={handleCloseDialog} color="primary">
          <CloseIcon sx={{ mr: 1 }} />
          Close
        </Button>
      </DialogActions>
    </Dialog>

      <Dialog open={cadDialogOpen} onClose={handleCloseCadDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#c8e5fa' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" component="span">
              Symbols | Footprints | 3D Models
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={cadContent === 'second' ? handleback : handleCloseCadDialog}>
                <ArrowBackIcon color="action" />
              </IconButton>
              <IconButton onClick={handleCloseCadDialog}>
                <CloseIcon color="action" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: '25px' }}>
          <Paper elevation={3} sx={{ padding: '25px', marginTop: '25px', minHeight: '380px' }}>
            <Box
              sx={{
                position: 'absolute',
                top: '75px',
                right: '30px',
                zIndex: 1
              }}
            >
              <Typography variant="body2">
                {data?.manufacturerName}{' | '}{data?.name}
              </Typography>
            </Box>
            <Box component="img" src="https://www.microchipusa.com/wp-content/uploads/2021/09/MUSA-Logo-sm.png" alt="Company Logo" className={classes.logo} />
            {cadContent === 'initial'
              ? <Box className={classes.firstcad} sx={{ marginTop: '3%', marginBottom: '5%' }}>
                <Typography variant="body1">
                  What CAD Models would you like us to build for you?
                </Typography>
                <Paper elevation={3} sx={{ padding: '10px', marginTop: '20px', width: '70%', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ marginTop: '6px' }}>
                    <ViewInArIcon /> {'  '}2D PCB Symbol & Footprint
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: '#113163',
                      color: 'white',
                      width: '150px',
                      fontSize: '14px',
                    }}
                    onClick={handleOpenCadDialog1}
                  >
                    Select <AddCircleOutlineIcon sx={{ fontSize: 'large' }} />
                  </Button>
                </Paper>
                <Paper elevation={3} sx={{
                  padding: '10px', marginTop: '15px', width: '70%', display: 'flex', justifyContent: 'space-between', cursor: 'not-allowed',
                  opacity: 0.5
                }}>
                  <Typography variant="body2" sx={{ marginTop: '6px' }}>
                    <ViewInArIcon /> {'  '}3D model only
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: '#113163',
                      color: 'white',
                      width: '150px',
                      fontSize: '14px',
                      cursor: 'not-allowed'
                    }}
                  >
                    Select <AddCircleOutlineIcon sx={{ fontSize: 'large' }} />
                  </Button>
                </Paper>
                {/* <Typography variant="body2" color="text.secondary" sx={{width:'70%',marginTop:'5px'}}>
                    Due to overwhelming popularity, we have temporarily paused "3D model only" requests to allow us to catch up. We will reopen for new "3D model only" requests very soon. 
                </Typography> */}
              </Box>
              : <Box className={classes.secondcad} sx={{marginTop:'1%'}}>
                <Typography variant="body2" color="text.secondary">
                    Thanks, to complete the request please fill in the boxes below :
                </Typography>
                <Grid container spacing={1} sx={{marginTop:'1%'}}>
                  <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Paper elevation={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Email :" 
                        size='small'
                        />
                    </Paper>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Paper elevation={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Pin Count :" 
                        size='small'
                        />
                    </Paper>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Paper elevation={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Datasheet :" 
                        size='small'
                        />
                    </Paper>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{marginTop:'1%'}}>
                    Please click the most appropriate category below :
                </Typography>
                <Paper elevation={3} sx={{marginTop:'1%'}}>
                  Categories
                </Paper>
                <Button
                    variant="contained"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: '#113163',
                      color: 'white',
                      width: '200px',
                      fontSize: '14px',
                      marginTop:'2%'
                    }}
                  >
                    Submit Request <AddCircleOutlineIcon sx={{ fontSize: 'large' }} />
                  </Button>
              </Box>
            }
            <Link href={`https://www.samacsys.com/`} target='_blank'>
              <Box
                component="img"
                src="https://microchipusa.componentsearchengine.com/graphics/logo.png"
                alt="Logo"
                sx={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '35px',
                  width: '15%',
                  height: 'auto'
                }}
              />
            </Link>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LeftComponent