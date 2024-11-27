import React, { useEffect, useState } from 'react'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import EditIcon from '@mui/icons-material/Edit'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined'
import HeadphonesIcon from '@mui/icons-material/Headphones'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  InputBase
} from '@mui/material'
import Link from 'next/link'
import CloseIcon from '@mui/icons-material/Close'
import MicrochipLogo from './Menu_images/MicrochipLogo.png'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import Badge from '@mui/material/Badge'
import Divider from '@mui/material/Divider'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import classes from './index.module.scss'
import MenuBottom from './MenuBottom'

const Menu = () => {
  const theme = useTheme()
  const router = useRouter()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmallWidth = useMediaQuery('(max-width:900px)')
  const isBelow1070px = useMediaQuery('(max-width:1200px)')

  const [selectedTab, setSelectedTab] = useState(-1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartAnchorEl, setCartAnchorEl] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [id, setId] = useState(null)
  const [heading, setHeading] = useState('Home')
  const [fileData, setFileData] = useState([])
  const [productDetails, setProductDetails] = useState([]);
  const [searchResult, setSearchResult] = useState([])

  const [showParentContainer, setShowParentContainer] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [activeParentId, setActiveParentId] = useState(null);
  const [activeChildId, setActiveChildId] = useState(null); 
  const [expandedParentId, setExpandedParentId] = useState(null);
  const [expandedSubId, setExpandedSubId] = useState(null); 
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState('');
  const [menuLoading, setMenuLoading] = useState(true);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCartItems = localStorage.getItem('cartItems')
      return savedCartItems ? JSON.parse(savedCartItems) : []
    } catch (e) {
      console.error('Error parsing cart items from local storage:', e)
      return []
    }
  })

  useEffect(() => {
    fetchMenuItems();
    setCurrentPath(window.location.pathname)

    const fetchCartProducts = async () => {
      try {
        const cartProductIds = JSON.parse(localStorage.getItem('cartItems') || '[]').map(
          item => item.productId,
        )
        const fetchProductDetails = cartProductIds.map(id =>
          axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/${id}`),
        )
        const responses = await Promise.all(fetchProductDetails)
        const updatedCartItems = responses.map(response => response.data)
        setCartItems(prevItems =>
          prevItems.map(item => ({
            ...item,
            ...updatedCartItems.find(product => product.productId === item.productId),
          })),
        )
      } catch (error) {
        console.error('Error fetching cart products:', error)
      }
    };
  
    fetchCartProducts();

    const handleStorageChange = () => {
      try {
        const updatedCartItems = localStorage.getItem('cartItems')
        setCartItems(updatedCartItems ? JSON.parse(updatedCartItems) : [])
      } catch (e) {
        console.error('Error parsing updated cart items from local storage:', e)
      }
    };
 
    window.addEventListener('storage', handleStorageChange);
 
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    }

  }, []);
 
  useEffect(() => {
    if (router.isReady && router.query.id) {
      setId(router.query.id)
    }
  }, [router.isReady, router.query])
 

  useEffect(() => {
    localStorage.setItem('fileData', JSON.stringify(fileData))
    if (fileData.length > 0) {
      window.location.href = '/uploads'
    }
  }, [fileData])

  useEffect(() => {
    if (searchResult.length === 1) {
      let keys = Object.keys(searchResult[0])

      if (keys.length === 4) {
        window.location.href = `/product/${searchResult[0].manufacturerSlug}/${searchResult[0].categorySlug}/${searchResult[0].sku}`
      } else {
        // localStorage.setItem('searchTerm', searchTerm);
        const categorySlug = searchResult[0].slug;
        window.location.href = `/categorySearch/${categorySlug}/${searchTerm}`
      }
    } else if (searchResult.length > 1) {
      // localStorage.setItem('searchTerm', searchTerm);
      // localStorage.setItem('searchResult', JSON.stringify(searchResult));
      // const categoryId = searchResult[0].categoryId;
      window.location.href = `/search-results/${searchTerm}`
    }
  }, [searchResult])

  useEffect(() => {
    console.log("breadcrumb: ", breadcrumb);
  }, [breadcrumb]);

  // Handle removing a product from the cart
  const handleRemoveFromCart = productId => {
    // Remove item from cart
    const updatedCartItems = cartItems.filter(item => item.productId !== productId)

    // Save updated cart items to localStorage
    try {
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems))
      window.dispatchEvent(new Event('storage'))
    } catch (e) {
      console.error('Error saving cart items to local storage:', e)
    }

    // Update local state
    setCartItems(updatedCartItems)
    location.reload()
  }

  const handleCartOpen = async event => {
    setCartOpen(true)
    setCartAnchorEl(event.currentTarget)
  }

  const calculateSubtotal = () => {
    // Ensure cartItems is not empty and has valid price and quantity
    if (cartItems && cartItems.length > 0) {
      return cartItems.reduce((acc, product) => {
        const productTotal =
          product.price && product.quantity ? product.price * product.quantity : 0
        return acc + productTotal
      }, 0)
    }
    return 0
  }
  const subtotal = calculateSubtotal()

  const handleCartClose = () => {
    setCartOpen(false)
    setAnchorEl(null)
  }

  const handleViewCart = () => {
    setHeading("Cart");
    // router.push('/cart');
    window.location.href = '/cart'
    handleCartClose();
  }

  const handleCheckout = () => {
    setHeading("Checkout");
    //router.push('/checkout');
    window.location.href = '/checkout'
    handleCartClose();
  }

  const toggleDrawer = open => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawerOpen(open)
  }

  const handleQuantityChange = (id, value) => {
    const newQuantity = parseInt(value, 10)
    if (newQuantity >= 1) {
      updateCartQuantity(id, newQuantity)
    }
  }

  const updateCartQuantity = (id, newQuantity) => {
    const updatedCartItems = [...cartItems]
    const existingProductIndex = updatedCartItems.findIndex(item => item.productId === id)

    if (existingProductIndex >= 0) {
      updatedCartItems[existingProductIndex].quantity = newQuantity
    }

    try {
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems))
      window.dispatchEvent(new Event('storage'))
    } catch (e) {
      console.error('Error saving cart items to local storage:', e)
    }

    setCartItems(updatedCartItems)
  }

  // const handleFileUpload = event => {
  //   const file = event.target.files[0]

  //   const fileExtension = file.name.split('.').pop()

  //   if (fileExtension === 'csv') {
  //     parseCsvFile(file)
  //   } else {
  //     console.error('Unsupported file format')
  //   }
  // }

  // const parseCsvFile = file => {
  //   Papa.parse(file, {
  //     complete: result => {
  //       console.log('Parsed CSV Data:', result.data)
  //       setFileData(result.data)
  //     },
  //     header: false,
  //   })
  // }

  const handleFileUpload = event => {
    const file = event.target.files[0]
    const fileExtension = file.name.split('.').pop().toLowerCase()
  
    if (fileExtension === 'csv') {
      parseCsvFile(file)
    } else if (fileExtension === 'txt') {
      parseTextFile(file)
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcelFile(file)
    } else {
      console.error('Unsupported file format')
    }
  }
  
  const parseCsvFile = file => {
    Papa.parse(file, {
      complete: result => {
        setFileData(result.data)
      },
      header: false,
    })
  }
  
  const parseTextFile = file => {
    const reader = new FileReader()
    reader.onload = event => {
      const textData = event.target.result
      setFileData(textData.split('\n')) 
    }
    reader.readAsText(file)
  }
  
  const parseExcelFile = file => {
    const reader = new FileReader()
    reader.onload = event => {
      const data = new Uint8Array(event.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      setFileData(excelData)
    }
    reader.readAsArrayBuffer(file)
  }

  const handleSearchClick = async () => {
    setLoading(true);
    const searchString = String(searchTerm);
    if (searchString) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/search`,
          //`https://localhost:7053/api/Categories/search`,
          {
            Search: searchString
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.data.length > 0) {
          setSearchResult(response.data)
        } else {
          window.location.href = `/not-found`
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
      } finally{
        setLoading(false);
      }
    } else {
      console.log('Please enter a search term')
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Menu`,
        //'https://localhost:7053/api/Menu',
      )
      const data = response.data
      const sortedMenuItems = data.sort((a, b) => a.menuOrder - b.menuOrder)
      setMenuItems(sortedMenuItems)
      console.log("menuItems: ", sortedMenuItems);

        if (typeof window !== "undefined") {
          // const currentPathName = window.location.pathname;
          // console.log("currentPathName: ", currentPathName);

          const pathSegments = window.location.pathname.split("/");
          console.log("pathSegments: ", pathSegments) 
          const mainCategory = pathSegments[1];
          const sortedMenuItem = sortedMenuItems.find(item => item.urlName === "/"+mainCategory);

          if (sortedMenuItem && sortedMenuItem.menuType === "payload") {
            setBreadcrumb(sortedMenuItem.menuName);
          } else {
            setBreadcrumb("");
          }
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally{
        setMenuLoading(false);
      }
  };

  const handleMouseEnter = (parentId, childId = null) => {
    setActiveParentId(parentId)
    setShowParentContainer(true)
    setActiveChildId(childId)
  }

  const handleMouseLeave = () => {
    setActiveParentId(null)
    setActiveChildId(null)
    setShowParentContainer(false)
  }

  const getChildItems = parentId => {
    return menuItems.filter(item => item.parentId === parentId)
  }

  const getSubChildItems = childId => {
    return menuItems.filter(item => item.parentId === childId)
  }

  const getMenuIcon = (menuName, isActive) => {
    const activeStyle = isActive ? { color: '#f5d949' } : {};
    switch (menuName) {
      case 'Home':
        return <HomeOutlinedIcon className={classes.icon} style={activeStyle} />;
      case 'About Us':
        return <InfoOutlinedIcon className={classes.icon} style={activeStyle} />;
      case 'Products':
        return <LocalAtmOutlinedIcon className={classes.icon} style={activeStyle} />;
      case 'Manufacturers':
        return <FolderCopyOutlinedIcon className={classes.icon} style={activeStyle} />;
      case 'Resources':
        return <LayersOutlinedIcon className={classes.icon} style={activeStyle} />;
      case 'News':
        return <ArticleOutlinedIcon className={classes.icon} style={activeStyle} />;
      case 'Contact':
        return <SmsOutlinedIcon className={classes.icon} style={activeStyle} />;
      default:
        return null
    }
  };

  const handleParentClick = parentId => {
    setExpandedParentId(expandedParentId === parentId ? null : parentId)
    setExpandedSubId(null)
  }

  const handleSubItemClick = subId => {
    setExpandedSubId(expandedSubId === subId ? null : subId)
  }

  const handleMenuItemClick = (index, name, url) => {
    setSelectedTab(index);
    setHeading(name);
    if (url) {
      router.push(url);
    }
  };

  const isMenuItemActive = (parentItem, currentPath) => {
    if (currentPath === parentItem.urlName) return true;

    const childItems = getChildItems(parentItem.id);
    for (const child of childItems) {
      if (currentPath === child.urlName) return true;

      const subChildItems = getSubChildItems(child.id);
      for (const subChild of subChildItems) {
        if (currentPath === subChild.urlName) return true;
      }
    }
  
    return false;
  };  

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)', 
      boxShadow: theme.shadows[1], 
      fontSize: 11, 
      border: '2px solid #1B5188'
      // border: '1px solid rgba(27, 81, 136, 0.3)',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
      '&::before': {
        borderColor: 'rgba(0, 0, 0, 0.12)', 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        border: '1.8px solid #1B5188'
        // border: '1px solid rgba(27, 81, 136, 0.3)',
      },
    },
  }));
  
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>

          <Box sx={{ flex: 1, justifyContent: 'flex-start', textAlign: 'left' }}>
            <Box
              component="img"
              src={MicrochipLogo.src}
              alt="Microchip"
              title="Microchip Logo"
              sx={{
                ml: isSmallScreen || isSmallWidth ? 0 : 2,
                mt: isSmallScreen || isSmallWidth ? 2 : 4,
                mb: 2,
                width: isSmallScreen || isSmallWidth ? '150px' : '200px',
                height: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = '/'}
            />
          </Box>

          <Box sx={{ flex: 2, justifyContent: 'center', mx: 2 }}>
            <Grid item xs={12} sm={4.1} marginLeft={2} marginRight={isSmallScreen ? 1 : 0}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        backgroundColor: '#fff', 
                        border: '1.5px solid #f1f1f1',
                        padding: '1px',
                      }}
                    >
                      <LightTooltip 
                        title="Upload a .CSV or .XLSX with a list of all part numbers" 
                        arrow
                      >
                      <IconButton
                        component="label"
                        sx={{
                          padding: '10px',
                          backgroundColor: 'transparent',
                          '&:hover': {
                            backgroundColor: '#e0e0e0',
                          },
                        }}
                      >
                        <FileUploadIcon sx={{ color: '#1B5188' }} /> 
                        <input
                          type="file"
                          accept=".csv, .xls, .xlsx, .txt"
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                        />
                      </IconButton>
                      </LightTooltip>
                      <InputBase
                        fullWidth
                        placeholder="Enter keyword or part #"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                          height: '40px',
                          paddingLeft: '8px',  
                          color: '#000',
                          fontSize: '16px',
                          '& input': {
                            padding: '10px 0', 
                          },
                        }}
                      />

                    <IconButton
                      onClick={handleSearchClick}
                      disabled={!searchTerm} 
                      sx={{
                        borderRadius: '50%',
                        padding: '10px',
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: searchTerm ? '#e0e0e0' : 'transparent', 
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} sx={{ color: '#1B5188' }} /> 
                      ) : (
                        <SearchIcon sx={{ color: searchTerm?'#1B5188':'#909090' }} /> 
                      )}
                    </IconButton>
                  </Box>
                </Grid>
            </Box>

        <Box sx={{ flex: 1, justifyContent: 'flex-end', textAlign: 'right', marginRight:'10px' }}>
          <Box sx={{ textAlign: 'right' }}>
            <IconButton size="small">
              <HeadphonesIcon sx={{ fontSize: '1rem', mb: '3px', color: '#AA0000' }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                fontSize: isSmallScreen || isSmallWidth ? '0.7rem' : '1rem',
                color: '#AA0000',
                display: 'inline',
                ml: 1,
              }}
            >
              Talk to a team member!
            </Typography>
            <a href="tel:+18882515467" style={{ textDecoration: 'none', display: 'block', marginTop: '4px' }}>
              <Typography
                sx={{
                  fontSize: isSmallScreen || isSmallWidth ? '0.7rem' : '1rem',
                  color: 'black',
                  fontWeight: '600',
                }}
              >
                +1-888-251-5467
              </Typography>
            </a>
          </Box>
        </Box>

        </Box>
        <Box sx={{ borderBottom: '1px solid lightgray', mt: 1, mb: isBelow1070px ? 1 : 0 }} />
        <AppBar
          position="static"
          color="transparent"
          sx={{ boxShadow: 'none', mt: isBelow1070px ? 1 : 2 }}
        >
          <Toolbar
            sx={{ justifyContent: 'space-between', mt: '-16px', mb: '2%', pl: '5px !important' }}
          >
            {isBelow1070px ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <SwipeableDrawer
                  anchor="left"
                  open={drawerOpen}
                  onClose={toggleDrawer(false)}
                  onOpen={toggleDrawer(true)}
                  PaperProps={{
                    sx: {
                      width: '300px',
                    },
                  }}
                >
                  <List>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      padding="0px 16px 16px 8px"
                      marginTop="-5px"
                      backgroundColor="#F0F0F0"
                      color="#7c7d81"
                    >
                      <Typography variant="h5" sx={{ mt: '5px', ml: '10px' }}>
                        Menu
                      </Typography>
                      <IconButton
                        onClick={toggleDrawer(false)}
                        sx={{ width: '0.5rem', color: '#B8B8B8' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    {menuItems.filter(item => item.parentId === 0).map((parentItem, index) => {
                      const hasChildren = menuItems.some(item => item.parentId === parentItem.id); 
                      return (
                        <div key={parentItem.id}>
                          <ListItem button onClick={() => 
                          handleMenuItemClick(index, parentItem.menuName, parentItem.urlName)} 
                          sx={{ backgroundColor: 'white', border: 'none', 
                            borderBottom: '0.1px solid #D3D3D3', color: '#717173', fontSize: '1.25rem',
                            '&:hover': {
                              color: 'black',
                            },
                           }}>
                            <ListItemIcon sx={{ minWidth: 0, 
                            '&:hover': {
                              color: 'red', 
                            }
                            , }}>{getMenuIcon(parentItem.menuName)}</ListItemIcon>
                            <ListItemText primary={parentItem.menuName} 
                            sx={{ cursor: 'pointer', '& .MuiTypography-root': { fontSize: '1.2rem' } }} />
                            
                            {hasChildren && (
                              <ListItemIcon sx={{ minWidth: 0, color: 'gray', cursor: 'pointer',
                               }} onClick={(e) => { 
                                e.stopPropagation(); 
                                handleParentClick(parentItem.id);
                              }}>
                                <KeyboardArrowDownIcon />
                              </ListItemIcon>
                            )}
                          </ListItem>

                          {expandedParentId === parentItem.id && (
                            <Box pl={4}>
                              {menuItems.filter(item => item.parentId === parentItem.id).map((childItem) => {
                                const hasSubChildren = menuItems.some(item => item.parentId === childItem.id);
                                return (
                                  <div key={childItem.id}>
                                    <ListItem button onClick={() => 
                                    handleMenuItemClick(index, childItem.menuName, childItem.urlName)}
                                     sx={{ backgroundColor: 'white', border: 'none',
                                       color: '#717173', '& .MuiTypography-root': { fontSize: '1.15rem' },
                                      '&:hover': {
                                        color: 'black',
                                      },
                                     }}>
                                      <ListItemText primary={childItem.menuName} />
                                      {hasSubChildren && (
                                        <ListItemIcon sx={{ minWidth: 0, color: 'gray', cursor: 'pointer',
                                         }} onClick={(e) => {
                                          e.stopPropagation(); 
                                          handleSubItemClick(childItem.id);
                                        }}>
                                          <KeyboardArrowDownIcon />
                                        </ListItemIcon>
                                      )}
                                    </ListItem>

                                    {expandedSubId === childItem.id && hasSubChildren && (
                                      <Box pl={4}>
                                        {menuItems.filter(item => item.parentId === childItem.id).map((subChildItem) => (
                                          <ListItem key={subChildItem.id} button sx={{ minWidth: 0, color: 'gray', cursor: 'pointer','& .MuiTypography-root': { fontSize: '1.1rem' },
                                            '&:hover': {
                                              color: 'black',
                                            },
                                           }} onClick={() => handleMenuItemClick(index, subChildItem.menuName, subChildItem.urlName)}>
                                            <ListItemText primary={subChildItem.menuName} />
                                          </ListItem>
                                        ))}
                                      </Box>
                                    )}
                                  </div>
                                );
                              })}
                            </Box>
                          )}
                        </div>
                      );
                    })}
                  </List>
                </SwipeableDrawer>
              </>
            ) : (
              menuLoading ? (
                <div className={classes.menuContainer}>
                  {/* <Skeleton height={20} width="80%" count={3} /> */}
                  <div style={{width:'925px'}}></div>
                </div>
              ) : (
                <div className={classes.menuContainer}>
                  <div className={classes.menuBar}>
                    {menuItems.filter(item => item.parentId === 0).map(parentItem => {
                      const childItems = getChildItems(parentItem.id);
                      const isActive = isMenuItemActive(parentItem, currentPath);
            
                      return (
                        <div
                          key={parentItem.id}
                          className={`${classes.menuItem} ${isActive ? classes.activeItem : ''} accentFont`}
                          onMouseEnter={() => handleMouseEnter(parentItem.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <a className={classes.menuLink} href={parentItem.urlName || '#'}>
                            {getMenuIcon(parentItem.menuName, isActive)}
                            {parentItem.menuName}
                            {childItems.length > 0 && (
                              <span>
                                <ArrowDropDownIcon className={classes.triangleArrow1} />
                              </span>
                            )}
                          </a>
                          {showParentContainer && activeParentId === parentItem.id && childItems.length > 0 && (
                            <div className={classes.submenuContainer}>
                               {childItems.map(childItem => {
                                    const subChildItems = getSubChildItems(childItem.id)

                                    return (
                                      <div
                                        key={childItem.id}
                                        className={`${classes.submenuItem} accentFont ${
                                          childItem.menuName === 'Industry Information'
                                            ? classes.industryInfoHighlight
                                            : ''
                                        }`}
                                        onMouseEnter={() =>
                                          handleMouseEnter(activeParentId, childItem.id)
                                        }
                                        onMouseLeave={handleMouseLeave}
                                      >
                                        <a
                                          className={`${classes.submenuLink} accentFont ${
                                            childItem.menuName === 'Industry Information'
                                              ? classes.industryInfoLink
                                              : ''
                                          }`}
                                          href={childItem.urlName}
                                        >
                                          {childItem.menuName === 'Industry Information' && (
                                            <span className={classes.iconWithText}>
                                              <svg
                                                aria-hidden="true"
                                                className={classes.microchipIcon}
                                                viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path d="M416 48v416c0 26.51-21.49 48-48 48H144c-26.51 0-48-21.49-48-48V48c0-26.51 21.49-48 48-48h224c26.51 0 48 21.49 48 48zm96 58v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42V88h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zm0 96v12a6 6 0 0 1-6 6h-18v6a6 6 0 0 1-6 6h-42v-48h42a6 6 0 0 1 6 6v6h18a6 6 0 0 1 6 6zM30 376h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6zm0-96h42v48H30a6 6 0 0 1-6-6v-6H6a6 6 0 0 1-6-6v-12a6 6 0 0 1 6-6h18v-6a6 6 0 0 1 6-6z"></path>
                                              </svg>
                                            </span>
                                          )}
                                          {childItem.menuName}
                                          {subChildItems.length > 0 && (
                                            <span className={classes.triangleArrow}>▸</span>
                                          )}
                                        </a>
                                        {/* <a
                                          className={`${classes.submenuLink} accentFont ${
                                            childItem.menuName === 'Industry Information'
                                              ? classes.industryInfoLink
                                              : ''
                                          }`}
                                          href={childItem.urlName}
                                        >
                                          {childItem.menuName === 'Industry Information' && (
                                            <span>
                                              <i className="fas fa-microchip"></i>
                                              {childItem.menuName}
                                            </span>
                                          )}
                                          {childItem.menuName !== 'Industry Information' &&
                                            childItem.menuName}
                                          {subChildItems.length > 0 && (
                                            <span className={classes.triangleArrow}>▸</span>
                                          )}
                                        </a> */}
                                        {showParentContainer &&
                                          activeChildId === childItem.id &&
                                          subChildItems.length > 0 && (
                                            <div className={classes.subsubmenuContainer}>
                                              {subChildItems.map(subChildItem => (
                                                <a
                                                  key={subChildItem.id}
                                                  className={`${classes.subsubmenuLink} accentFont`}
                                                  href={subChildItem.urlName}
                                                >
                                                  {subChildItem.menuName}
                                                </a>
                                              ))}
                                            </div>
                                          )}
                                      </div>
                                    )
                                  })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
            {/* <Link href={`/rfq`}> */}
              <Button
                variant="contained"
                color="primary"
                endIcon={<EditIcon />}
                sx={{
                  backgroundColor: '#f5d949',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#113163',
                    color: 'white',
                    '& .MuiButton-endIcon': {
                      color: 'white',
                    },
                  },
                  color: 'black',
                  '& .MuiButton-endIcon': {
                    color: 'black',
                  },
                  pt: '10px',
                  mt: '10px',
                  mr: '10px',
                  fontSize: '12px',
                }}
                onClick={() => window.location.href = '/rfq'}
              >
                REQUEST A QUOTE
              </Button>
            {/* </Link> */}
            <IconButton
              color="primary"
              onClick={handleCartOpen}
              aria-controls="cart-popover"
              aria-haspopup="true"
              sx={{
                cursor: cartItems.length > 0 ? 'pointer' : 'not-allowed',
                opacity: cartItems.length > 0 ? 1 : 0.5,
                backgroundColor: '#f5d949',
                '&:hover': {
                  backgroundColor: '#113163',
                  color: 'white',
                },
                mt: '10px',
              }}
            >
              <Badge badgeContent={cartItems.length} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Popover
          open={cartOpen}
          anchorEl={cartAnchorEl}
          onClose={handleCartClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              padding: 2,
              maxWidth: 400,
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Box display="flex" flexDirection="column" height="100%" justifyContent="space-between">
            {cartItems.length === 0 ? (
              <Typography variant="body1" align="center">
                No products have been added to the cart.
              </Typography>
            ) : (
              <>
                <Box flex={1} overflow="auto">
                  {cartItems.map((product, index) => (
                    <React.Fragment key={product.productId}>
                      <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
                        <img
                          src={
                            product.pictureUrl ||
                            'https://www.microchipusa.com/wp-content/uploads/2023/07/LT6231CDD_TRPBF.jpg'
                          }
                          alt={product.name}
                          style={{ width: 60, height: 60, marginRight: 16, flexShrink: 0,
                            filter: 'sepia() hue-rotate(180deg) saturate(140%) brightness(90%) contrast(128%)'
                           }}
                        />
                        <Box flex={1} minWidth="0">
                          <Typography variant="body1" noWrap>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Price: ${product.price?.toFixed(2)}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={1}>
                            <TextField
                              type="number"
                              size="small"
                              value={product.quantity}
                              onChange={e =>
                                handleQuantityChange(product.productId, e.target.value)
                              }
                              inputProps={{ min: 1 }}
                              sx={{ width: '90px' }}
                            />
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveFromCart(product.productId)}
                          sx={{ ml: 2, whiteSpace: 'nowrap' }}
                        >
                          Remove
                        </Button>
                      </Box>
                      {index < cartItems.length - 1 && <Divider sx={{ my: 2 }} />}
                    </React.Fragment>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Subtotal</Typography>
                  <Typography variant="h6">${(subtotal || 0).toFixed(2)}</Typography>
                </Box>

                <Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleViewCart}
                    sx={{
                      backgroundColor: '#f5d949',
                      color: 'black',
                      mb: 1,
                      '&:hover': {
                        backgroundColor: '#f5d949', // Prevent color change on hover
                      },
                    }}
                  >
                    View Cart
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleCheckout}
                    sx={{
                      backgroundColor: '#29499f',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#29499f', // Prevent color change on hover
                      },
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Popover>
      </Box>

      {breadcrumb!=='' ? (
        <MenuBottom breadcrumb={breadcrumb}/>
      ) : null}
    </>
  )
}

export default Menu
