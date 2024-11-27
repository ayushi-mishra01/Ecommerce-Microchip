import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Box,
  Divider,
  Grid,
  TextField,
  Typography,
  Button,
  Link,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/system'
import axios from 'axios'
import CustomPagination from './CustomPagination'
import { useMediaQuery, useTheme } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
// import Link from 'next/link'

import styles from './index.module.scss'

const excludedFields = [
  'productId',
  'shortDescription',
  'description',
  'displayPosition',
  'sku',
  'price',
  'stockQuantity',
  'manufacturer',
  'manufacturerId',
  'manufacturerSlug',
  'inStock',
  'productStatusId',
  'partDetailsPdf',
  'datasheetPdfurl',
  'pictureUrl',
  'visibility',
  'featured',
  'published',
  'fullDescription',
  'chatGptprompt',
  'createdBy',
  'modifiedBy',
  'createdDate',
  'modifiedDate',
  'categorySlug',
]

const Grids = ({ categoryId, manufacturerId, manufacturerName }) => {
  const [categoriesData, setCategoriesData] = useState([])
  const [fixedCategoriesData, setFixedCategoriesData] = useState([])
  const [returnedCategoriesData, setReturnedCategoriesData] = useState([])
  const [returnedDataMap, setReturnedDataMap] = useState({})
  const [returnedDataMapFixed, setReturnedDataMapFixed] = useState({})
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [searchQuery, setSearchQuery] = useState('')
  const [sorting, setSorting] = useState({
    field: '',
    order: 'asc',
  })
  const [productDetails, setProductDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingCatData, setLoadingCatData] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerms, setSearchTerms] = useState({})
  const [searchTermsFixed, setSearchTermsFixed] = useState({})
  const [priceSearchQuery, setPriceSearchQuery] = useState('')
  const [categoryName, setCategoryName] = useState('')
  // const [manufacturerName, setManufacturerName] = useState('')
  const [totalRows, setTotalRows] = useState(0)
  const [filterApplied, setFilterApplied] = useState(true)
  const [isPageAlreadyZero, setIsPageAlreadyZero] = useState(false)
  const [searchBarValue, setSearchBarValue] = useState('')
  const [selectedCategories, setSelectedCategories] = useState({
    [-1]: {
      table: 'Manufacturer',
      values: [Number(manufacturerId)],
    },
  })

  const [collapsedCategories, setCollapsedCategories] = useState({})
  const [gridHeight, setGridHeight] = useState('auto')

  const theme = useTheme()
  const isSmallWidth = useMediaQuery('(max-width:900px)')

  const prepareDataForBackend = () => {
    return Object.keys(selectedCategories).map(parameterNameId => ({
      parameterNameId: parseInt(parameterNameId, 10),
      table:
        parseInt(parameterNameId, 10) < 0
          ? selectedCategories[parameterNameId].table.replace(/\s+/g, '')
          : 'Parameter',
      parameterValueIds: selectedCategories[parameterNameId]?.values.join(','),
    }))
  }

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetParametersByCategory/${categoryId}`,
        )

        const groupedData = response.data.reduce((acc, item) => {
          if (!acc[item.parameter_name_id]) {
            acc[item.parameter_name_id] = {
              name: item.parameter_name,
              id: item.parameter_name_id,
              options: [],
            }
          }
          acc[item.parameter_name_id].options.push({
            id: item.parameter_value_id,
            value: item.parameter_value,
          })
          return acc
        }, {})

        const transformedData = Object.values(groupedData)
        setCategoriesData(transformedData)
      } catch (error) {
        console.error('Error fetching categories data:', error)
      } finally {
        setLoadingCatData(false)
      }
    }

    const fetchFixedCategoriesData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetFixedParametersByCategory/${categoryId}`,
          //`https://localhost:7053/api/Categories/GetFixedParametersByCategory/${categoryId}`
        )
        const groupedData = response.data.reduce((acc, item) => {
          if (!acc[item.table_name]) {
            acc[item.table_name] = {
              name: item.table_name,
              id: -(Object.keys(acc).length + 1),
              options: [],
            }
          }

          const isDuplicate = acc[item.table_name].options.some(
            option => option.parameter_id === item.parameter_id,
          )

          if (!isDuplicate) {
            acc[item.table_name].options.push({
              id: item.parameter_id,
              value: item.parameter_value,
            })
          }

          return acc
        }, {})

        const transformedData = Object.values(groupedData)
        setFixedCategoriesData(transformedData)
      } catch (error) {
        console.error('Error fetching fixed categories data:', error)
      }
    }

    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetCategoryNameById/${categoryId}`,
          // `https://localhost:7053/api/Categories/GetCategoryNameById/${categoryId}`
        )
        if (response.status === 200) {
          setCategoryName(response.data)
          document.title = response.data
        }
      } catch (error) {
        console.error('Error fetching category name:', error)
      }
    }

    fetchCategoriesData()
    fetchFixedCategoriesData()
    fetchCategoryName()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      if (!filterApplied) {
        try {
          const payload = prepareDataForBackend()
          const filterRequest = {
            filters: payload,
            search: searchQuery,
            price: priceSearchQuery,
          }
          const response = await axios.post(
            `${
              process.env.NEXT_PUBLIC_PUBLISHED_API_URL
            }/api/Categories/getFilteredProductsPaginatedSearch?categoryid=${categoryId}&pageNumber=${
              page + 1
            }&pageSize=${rowsPerPage}`,
            // `https://localhost:7053/api/Categories/getFilteredProductsPaginatedSearch?categoryid=${categoryId}&pageNumber=${
            //   page + 1
            // }&pageSize=${rowsPerPage}`,
            filterRequest,
            {
              header: {
                'Content-Type': 'application/json',
              },
            },
          )

          if (response.data && response.data.productsByCategory) {
            setProductDetails(response.data.productsByCategory)
            setTotalRows(response.data.totalRows)
          } else {
            setProductDetails([])
            setTotalRows(0)
          }
        } catch (error) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
      } else {
        try {
          const payload = prepareDataForBackend()
          const filterRequest = {
            filters: payload,
            search: searchQuery,
            price: priceSearchQuery,
          }
          const response = await axios.post(
            `${
              process.env.NEXT_PUBLIC_PUBLISHED_API_URL
            }/api/Categories/getFilteredProductsPaginatedSearch?categoryId=${categoryId}&pageNumber=${
              page + 1
            }&pageSize=${rowsPerPage}`,
            // `https://localhost:7053/api/Categories/getFilteredProductsPaginatedSearch?categoryId=${categoryId}&pageNumber=${
            //   page + 1
            // }&pageSize=${rowsPerPage}`,
            filterRequest,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          if (response.data && response.data.productsByCategory) {
            setProductDetails(response.data.productsByCategory)
            setTotalRows(response.data.totalRows)
          } else {
            setProductDetails([])
            setTotalRows(0)
          }
        } catch (error) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchProducts()
  }, [page, rowsPerPage, searchQuery, priceSearchQuery])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      if (!filterApplied) {
        try {
          const payload = prepareDataForBackend()
          const filterRequest = {
            filters: payload,
            search: searchQuery,
            price: priceSearchQuery,
          }
          const response = await axios.post(
            `${
              process.env.NEXT_PUBLIC_PUBLISHED_API_URL
            }/api/Categories/getFilteredProductsPaginatedSearch?categoryid=${categoryId}&pageNumber=${
              page + 1
            }&pageSize=${rowsPerPage}`,
            // `https://localhost:7053/api/Categories/getFilteredProductsPaginatedSearch?categoryid=${categoryId}&pageNumber=${
            //   page + 1
            // }&pageSize=${rowsPerPage}`,
            filterRequest,
            {
              header: {
                'Content-Type': 'application/json',
              },
            },
          )

          if (response.data && response.data.productsByCategory) {
            setProductDetails(response.data.productsByCategory)
            setTotalRows(response.data.totalRows)
          } else {
            setProductDetails([])
            setTotalRows(0)
          }
        } catch (error) {
          setError(error.message)
        } finally {
          setLoading(false)
          setIsPageAlreadyZero(false)
        }
      } else {
        try {
          const payload = prepareDataForBackend()
          const filterRequest = {
            filters: payload,
            search: searchQuery,
            price: priceSearchQuery,
          }
          const response = await axios.post(
            `${
              process.env.NEXT_PUBLIC_PUBLISHED_API_URL
            }/api/Categories/getFilteredProductsPaginatedSearch?categoryId=${categoryId}&pageNumber=${
              page + 1
            }&pageSize=${rowsPerPage}`,
            // `https://localhost:7053/api/Categories/getFilteredProductsPaginatedSearch?categoryId=${categoryId}&pageNumber=${
            //   page + 1
            // }&pageSize=${rowsPerPage}`,
            filterRequest,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          if (response.data && response.data.productsByCategory) {
            setProductDetails(response.data.productsByCategory)
            setTotalRows(response.data.totalRows)
          } else {
            setProductDetails([])
            setTotalRows(0)
          }
        } catch (error) {
          setError(error.message)
        } finally {
          setLoading(false)
          setIsPageAlreadyZero(false)
        }
      }
    }

    if (isPageAlreadyZero) {
      fetchProducts()
    }
  }, [isPageAlreadyZero])

  useEffect(() => {
    const getVariableDataFromBackend = async () => {
      try {
        const payload = prepareDataForBackend()
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetVariableParameterData_02_09?categoryId=` +
            categoryId,
          // 'https://localhost:7053/api/Categories/GetVariableParameterData_02_09?categoryId='+ categoryId,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const groupedData = response.data.reduce((acc, item) => {
          if (!acc[item.parameterNameId]) {
            acc[item.parameterNameId] = {
              name: item.parameterName,
              id: item.parameterNameId,
              options: [],
            }
          }
          acc[item.parameterNameId].options.push({
            id: item.parameterValueId,
            value: item.parameterValue,
          })
          return acc
        }, {})

        const transformedData = Object.values(groupedData)
        setReturnedCategoriesData(transformedData)
      } catch (error) {
        console.error('Error sending data:', error)
      }
    }

    const fetchFixedCategoriesStatus = async () => {
      try {
        const payload = prepareDataForBackend()
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories/GetFixedParameterData_02_09?categoryId=` +
            categoryId,
          // 'https://localhost:7053/api/Categories/GetFixedParameterData_02_09?categoryId='+ categoryId,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const statusMap = response.data.reduce((acc, item) => {
          const fixedCategoryTrimmed = item.fixedCategory.replace(/\s+/g, '')
          if (!acc[fixedCategoryTrimmed]) {
            acc[fixedCategoryTrimmed] = {}
          }
          acc[fixedCategoryTrimmed][item.fixedCategoryId] = true
          return acc
        }, {})
        setReturnedDataMapFixed(statusMap)
      } catch (error) {
        console.error('Error fetching fixed categories status:', error)
      }
    }

    if (Object.keys(selectedCategories).length > 0) {
      getVariableDataFromBackend()
      fetchFixedCategoriesStatus()
    }
  }, [selectedCategories])

  useEffect(() => {
    const newReturnedDataMap = {}
    returnedCategoriesData.forEach(category => {
      category.options.forEach(option => {
        if (!newReturnedDataMap[category.id]) {
          newReturnedDataMap[category.id] = {}
        }
        newReturnedDataMap[category.id][option.id] = true
      })
    })
    setReturnedDataMap(newReturnedDataMap)
  }, [returnedCategoriesData])

  useEffect(() => {
    const calculateHeight = () => {
      const screenWidth = window.innerWidth

      // Set height based on pageSize if screen width is greater than 1100px
      if (screenWidth > 900) {
        switch (rowsPerPage) {
          case 25:
            setGridHeight('1210px')
            break
          case 50:
            setGridHeight('2510px')
            break
          case 100:
            setGridHeight('5085px')
            break
          default:
            setGridHeight('1210px')
        }
      } else {
        setGridHeight('auto')
      }
    }

    calculateHeight()

    window.addEventListener('resize', calculateHeight)

    return () => {
      window.removeEventListener('resize', calculateHeight)
    }
  }, [rowsPerPage])

  const handleSelectionChange = (parameterNameId, parameterValueId, table) => {
    setSelectedCategories(prevState => {
      const currentSelections = prevState[parameterNameId]?.values || []
      const isSelected = currentSelections.includes(parameterValueId)

      const updatedSelections = isSelected
        ? currentSelections.filter(id => id !== parameterValueId)
        : [...currentSelections, parameterValueId]

      const newState = { ...prevState }

      if (updatedSelections.length > 0) {
        newState[parameterNameId] = {
          table: table,
          values: updatedSelections,
        }
      } else {
        delete newState[parameterNameId]
      }
      return newState
    })
  }

  const handleApplyClick = () => {
    setFilterApplied(true)
    if (page === 0) {
      setIsPageAlreadyZero(true)
    } else {
      setPage(0)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSearchBarValue('')
    setSelectedCategories({})
    setReturnedCategoriesData([])
    setReturnedDataMap({})
    setReturnedDataMapFixed({})
    setFilterApplied(false)
    if (page === 0) {
      setIsPageAlreadyZero(true)
    } else {
      setPage(0)
    }
  }

  const isOptionEnabled = (parameterNameId, optionId) => {
    return returnedDataMap[parameterNameId] && returnedDataMap[parameterNameId][optionId]
  }

  const isFixedOptionEnabled = (parameterName, optionId) => {
    const parameterNameTrimmed = parameterName.replace(/\s+/g, '')
    return (
      returnedDataMapFixed[parameterNameTrimmed] &&
      returnedDataMapFixed[parameterNameTrimmed][optionId]
    )
  }

  // const isClearDisabled=()=>{
  //   return  (Object.keys(returnedDataMap).length === 0 && Object.keys(returnedDataMapFixed).length === 0) && Object.keys(selectedCategories).length === 0;
  // }

  const isClearDisabled = () => {
    return (
      searchQuery.length === 0 &&
      Object.keys(returnedDataMap).length === 0 &&
      Object.keys(returnedDataMapFixed).length === 0 &&
      Object.keys(selectedCategories).length === 0
    )
  }

  const style = {
    py: 0,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    fontSize: '12px',
    backgroundColor: '#F3F4F6',
    // minWidth: '200px',
    height: '180px',
  }

  const scroll = {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    minWidth: '100%',
    cursor: 'pointer',
    height: 175,
    '&::-webkit-scrollbar': {
      width: 8,
      height: 0,
      // paddingRight: 10,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#ccc',
      borderRadius: 0,
    },
  }

  const parametricScroll = {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    minWidth: '100%',
    height: gridHeight,
    cursor: 'pointer',
    paddingRight: '2px',
    '&::-webkit-scrollbar': {
      width: 8,
      height: 0,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#ccc',
      borderRadius: 0,
    },
  }
  const horizontalScroll = {
    // display: 'flex',
    // overflowX: 'auto',
    // '&::-webkit-scrollbar': {
    //   height: 9,
    //   paddingRight: 10,
    // },
    // '&::-webkit-scrollbar-thumb': {
    //   backgroundColor: '#ccc',
    //   borderRadius: 4,
    // },
  }

  const StyledButton = styled(Button)({
    backgroundColor: '#e0e0e0',
    color: '#9e9e9e',
    borderRadius: '30px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  })

  const convertPascalToTitleCase = text => {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  const firstRecord = productDetails[0] || {}
  const columns = [
    // { field: 's.no.', headerName: 'S.No.' },
    {
      field: 'product',
      headerName: 'Product',
      sortable: true,
      renderCell: params => (
        <Grid
          container
          alignItems="center"
          spacing={1}
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            width: '270px',
            // marginTop: '5px',
            // marginBottom: '5px',
          }}
        >
          <Grid item>
            <img
              src={
                params.row.pictureUrl ||
                `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/389/8-SOIC.jpg`
              }
              alt="Product"
              style={{ width: 50, height: 50, marginRight: 10 }}
              className={styles.image}
              onError={e => {
                e.target.onerror = null
                e.target.src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/Volume0/opasdata/d220001/medias/images/389/8-SOIC.jpg`
              }}
            />
          </Grid>
          <Grid item xs zeroMinWidth>
            <Link
              href={`/manufacturer/${params.row.manufacturerSlug}/${params.row.categorySlug}/${params.row.sku}`}
              underline="none"
            >
              <div
                style={{
                  overflow: 'visible',
                  cursor: 'pointer',
                  color: '#2563EB',
                  fontWeight: 'bold',
                  // textDecoration: 'underline',
                }}
                // onClick={() => {
                //   window.location.href = `/product/${params.row.manufacturerSlug}/${params.row.categorySlug}/${params.row.sku}`
                // }}
              >
                {params.row.name}
              </div>
            </Link>
            <div style={{ marginTop: '2px', marginRight: '10px', fontSize: '12px' }}>
              {params.row.shortDescription}
            </div>
          </Grid>
        </Grid>
      ),
    },
    {
      field: 'manufacturer',
      headerName: 'Manufacturer',
      sortable: true,
      renderCell: params => (
        <Link href={`/manufacturer/${params.row.manufacturerSlug}`} underline="none">
          <div
            style={{
              cursor: 'pointer',
              color: '#2563EB',
            }}
            // onClick={() => {
            //   window.location.href = `/manufacturer/${params.row.manufacturerSlug}`
            // }}
          >
            {params.row.manufacturer}
          </div>
        </Link>
      ),
    },
    // {
    //   field: 'product',
    //   headerName: 'Product',
    //   sortable: true,
    //   renderCell: params => (
    //     <Grid
    //       container
    //       alignItems="center"
    //       spacing={1}
    //       sx={{
    //         display: 'flex',
    //         flexWrap: 'nowrap',
    //         width: '270px',
    //         marginTop: '5px',
    //         marginBottom: '5px',
    //       }}
    //     >
    //       <Grid item>
    //         <img
    //           src={
    //             params.row.pictureUrl ||
    //             `${process.env.NEXT_PUBLIC_IMAGE_URL}/wp-content/uploads/2024/06/XCF16PVO48C0973.jpg`
    //           }
    //           alt="Product"
    //           style={{ width: 50, height: 50, marginRight: 10 }}
    //           className={styles.image}
    //         />
    //       </Grid>
    //       <Grid item xs zeroMinWidth>
    //         <Link
    //           href={`/product/${params.row.manufacturerSlug}/${params.row.categorySlug}/${params.row.sku}`}
    //         >
    //           <div
    //             style={{
    //               overflow: 'visible',
    //               cursor: 'pointer',
    //               color: '#1A1552',
    //               textDecoration: 'underline',
    //             }}
    //             // onClick={() => {
    //             //   window.location.href = `/product/${params.row.manufacturerSlug}/${params.row.categorySlug}/${params.row.sku}`
    //             // }}
    //           >
    //             {params.row.name}
    //           </div>
    //         </Link>
    //         <div style={{ marginTop: '2px', marginRight: '10px', fontSize: '0.6rem' }}>
    //           {params.row.shortDescription}
    //         </div>
    //       </Grid>
    //     </Grid>
    //   ),
    // },
    // {
    //   field: 'manufacturer',
    //   headerName: 'Manufacturer',
    //   sortable: true,
    //   renderCell: params => (
    //     <Link href={`/manufacturer/${params.row.manufacturerSlug}`}>
    //       <div
    //         style={{
    //           cursor: 'pointer',
    //           color: '#1A1552',
    //           textDecoration: 'underline',
    //         }}
    //         // onClick={() => {
    //         //   window.location.href = `/manufacturer/${params.row.manufacturerSlug}`
    //         // }}
    //       >
    //         {params.row.manufacturer}
    //       </div>
    //     </Link>
    //   ),
    // },
    ...Object.keys(firstRecord)
      .filter(key => !excludedFields.includes(key) && key !== 'name' && key !== 'pictureUrl')
      .map(key => ({
        field: key,
        headerName: key,
        sortable: true,
        width: 'auto',
      })),
  ]

  const handleSort = field => {
    setSorting(prevSorting => ({
      field,
      order: prevSorting.field === field && prevSorting.order === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleSearch = (value, isPriceSearch = false) => {
    if (isPriceSearch) {
      setPriceSearchQuery(value)
    } else {
      setSearchQuery(searchBarValue)
    }
  }

  const sortedRows = productDetails.sort((a, b) => {
    // const multiplier = sorting.order === 'asc' ? 1 : -1
    // if (a[sorting.field] < b[sorting.field]) return -1 * multiplier
    // if (a[sorting.field] > b[sorting.field]) return 1 * multiplier
    // return 0
    const multiplier = sorting.order === 'asc' ? 1 : -1

    let fieldA = a[sorting.field]
    let fieldB = b[sorting.field]

    if (sorting.field === 'product') {
      fieldA = a.name
      fieldB = b.name
    }

    if (fieldA < fieldB) return -1 * multiplier
    if (fieldA > fieldB) return 1 * multiplier
    return 0
  })

  const handleSearchInputChange = (parameterNameId, searchValue) => {
    setSearchTerms(prevState => ({
      ...prevState,
      [parameterNameId]: searchValue.toLowerCase(),
    }))
  }

  const handleSearchInputChangeFixed = (parameterName, searchValue) => {
    setSearchTermsFixed(prevState => ({
      ...prevState,
      [parameterName]: searchValue.toLowerCase(),
    }))
  }

  const toggleCollapse = categoryId => {
    setCollapsedCategories(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }))
  }
  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{ display: 'flex', flexDirection: 'row', padding: '10px 15px' }}
      >
        {/* Left column - Category Grid section */}
        <Grid item xs={12} md={2.3} sx={{ width: '30px' }}>
          {/* Search bar */}
          <Grid container>
            <Grid item>
              <Typography
                variant="h6"
                component="span"
                sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}
              >
                {' '}
                Current Results:{' '}
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}
              >
                {loading ? <CircularProgress size={25} /> : totalRows}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search within"
                value={searchBarValue}
                onChange={event => setSearchBarValue(event.target.value)}
                inputProps={{ style: { fontSize: 12.5 } }}
                InputLabelProps={{ style: { fontSize: 6 } }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      type="submit"
                      aria-label="search"
                      onClick={event => handleSearch(event, false)}
                      disabled={loading}
                    >
                      {loading && searchQuery ? (
                        <CircularProgress size={15} sx={{ color: 'grey' }} />
                      ) : (
                        <SearchIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* Apply and clear buttons */}
          <Box sx={{ marginTop: 1.5, marginBottom: 1 }}>
            {(Object.keys(selectedCategories).length !== 0 || !isClearDisabled()) && (
              <Grid container spacing={1}>
                <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {Object.keys(selectedCategories).length !== 0 && (
                    <StyledButton
                      variant="contained"
                      sx={{
                        height: '2.5rem',
                        whiteSpace: 'nowrap',
                        fontSize: '12px',
                        color: Object.keys(selectedCategories).length === 0 ? 'default' : 'black',
                        backgroundColor:
                          Object.keys(selectedCategories).length === 0 ? 'default' : '#F5D949',
                        '&:hover': {
                          backgroundColor:
                            Object.keys(selectedCategories).length === 0 ? 'default' : '#113163',
                          color: 'white',
                        },
                      }}
                      disabled={
                        Object.keys(selectedCategories).length === 0 || (filterApplied && loading)
                      }
                      onClick={handleApplyClick}
                    >
                      {filterApplied && loading ? (
                        <>
                          <CircularProgress
                            size={20}
                            sx={{ color: 'white', marginRight: '0.5rem' }}
                          />
                          Applying
                        </>
                      ) : (
                        'Apply'
                      )}
                    </StyledButton>
                  )}
                  {!isClearDisabled() && (
                    <StyledButton
                      variant="contained"
                      sx={{
                        height: '2.5rem',
                        whiteSpace: 'nowrap',
                        fontSize: '12px',
                        color: isClearDisabled() ? 'default' : 'black',
                        backgroundColor: isClearDisabled() ? 'default' : 'white',
                        '&:hover': {
                          backgroundColor: isClearDisabled() ? 'default' : '#e0e0e0',
                        },
                      }}
                      onClick={handleClearFilters}
                      disabled={isClearDisabled() || (filterApplied && loading)}
                    >
                      Clear
                    </StyledButton>
                  )}
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Filter heading */}
          <Grid>
            <Typography
              component="span"
              sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}
            >
              FILTER OPTIONS
            </Typography>
          </Grid>
          {/* <div style={{ height: gridHeight, overflow: 'auto' }}> */}
          <Box
            sx={parametricScroll}
            // style={{ height: gridHeight, overflow: 'auto' }}
          >
            {fixedCategoriesData.map(category => (
              <Grid item key={category.id} sx={{ marginBottom: 1 }}>
                {/* <List sx={{ ...style, borderRadius: 0, border: '1px solid #D1D5DB' }}> */}
                <ListItem
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: '#E5E7EB',
                    padding: '1px 1px',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleCollapse(category.id)}
                >
                  <Typography sx={{ fontSize: '12px', fontWeight: 'bold', paddingLeft: '5px' }}>
                    {category.name}
                  </Typography>
                  <span>{collapsedCategories[category.id] ? <ExpandMore /> : <ExpandLess />}</span>
                </ListItem>
                {!collapsedCategories[category.id] && (
                  <>
                    <List sx={{ ...style, borderRadius: 0, border: '1px solid #D1D5DB' }}>
                      <Divider component="li" />
                      <ListItem sx={{ padding: 0 }}>
                        <Box sx={{ ...scroll, padding: '2px' }}>
                          {category.options
                            .filter(option => {
                              const searchTermFixed = searchTermsFixed[category.name] || ''
                              return (
                                option.value && option.value.toLowerCase().includes(searchTermFixed)
                              )
                            })
                            .map(option => (
                              <FormControlLabel
                                key={option.id}
                                control={
                                  <Checkbox
                                    checked={(
                                      selectedCategories[category.id]?.values || []
                                    ).includes(option.id)}
                                    onChange={() =>
                                      handleSelectionChange(category.id, option.id, category.name)
                                    }
                                    disabled={
                                      Object.keys(selectedCategories).length !== 0 &&
                                      !isFixedOptionEnabled(category.name, option.id)
                                    }
                                    sx={{
                                      // color: 'grey',
                                      padding: '0.1px', // Minimize checkbox padding
                                      '& .MuiSvgIcon-root': {
                                        fontSize: '17px',
                                        borderRadius: '1px', // Slight rounding for consistency
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography
                                    sx={{
                                      // whiteSpace: 'nowrap',
                                      fontSize: '11px',
                                      color:
                                        Object.keys(selectedCategories).length === 0 ||
                                        isFixedOptionEnabled(category.name, option.id)
                                          ? 'inherit'
                                          : 'gray',
                                      opacity:
                                        Object.keys(selectedCategories).length === 0 ||
                                        isFixedOptionEnabled(category.name, option.id)
                                          ? 1
                                          : 0.5,
                                    }}
                                  >
                                    {option.value}
                                  </Typography>
                                }
                                sx={{ margin: 0, padding: '2px 0' }}
                              />
                            ))}
                        </Box>
                      </ListItem>
                    </List>
                  </>
                )}
                {/* </List> */}
              </Grid>
            ))}

            {categoriesData.map(category => (
              <Grid item key={category.id} sx={{ marginBottom: 1 }}>
                {/* <List sx={{ ...style, borderRadius: 0, border: '1px solid #D1D5DB' }}> */}
                <ListItem
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: '#E5E7EB',
                    padding: '1px 1px',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleCollapse(category.id)}
                >
                  <Typography sx={{ fontSize: '12px', fontWeight: 'bold', paddingLeft: '5px' }}>
                    {category.name}
                  </Typography>
                  <span>{collapsedCategories[category.id] ? <ExpandMore /> : <ExpandLess />}</span>
                </ListItem>
                {!collapsedCategories[category.id] && (
                  <>
                    <List sx={{ ...style, borderRadius: 0, border: '1px solid #D1D5DB' }}>
                      <Divider component="li" />
                      <ListItem sx={{ padding: 0 }}>
                        <Box sx={{ ...scroll, padding: '2px' }}>
                          {category.options
                            .filter(option => {
                              const searchTerm = searchTerms[category.id] || ''
                              return option.value.toLowerCase().includes(searchTerm)
                            })
                            .map(option => (
                              <FormControlLabel
                                key={option.id}
                                control={
                                  <Checkbox
                                    checked={(
                                      selectedCategories[category.id]?.values || []
                                    ).includes(option.id)}
                                    onChange={() =>
                                      handleSelectionChange(category.id, option.id, category.name)
                                    }
                                    disabled={
                                      Object.keys(selectedCategories).length !== 0 &&
                                      !isOptionEnabled(category.id, option.id)
                                    }
                                    sx={{
                                      // color: 'grey',
                                      padding: '0.1px',
                                      '& .MuiSvgIcon-root': {
                                        fontSize: '17px',
                                        borderRadius: '1px',
                                      },
                                      // color: '#6B7280', // Grey color for unchecked
                                      // '&.Mui-checked': {
                                      //   color: '#4B5563', // Darker grey for checked
                                      // },
                                    }}
                                  />
                                }
                                label={
                                  <Typography
                                    sx={{
                                      // whiteSpace: 'nowrap',
                                      fontSize: '11px',
                                      color:
                                        Object.keys(selectedCategories).length === 0 ||
                                        isOptionEnabled(category.id, option.id)
                                          ? 'inherit'
                                          : 'gray',
                                      opacity:
                                        Object.keys(selectedCategories).length === 0 ||
                                        isOptionEnabled(category.id, option.id)
                                          ? 1
                                          : 0.5,
                                    }}
                                  >
                                    {option.value}
                                  </Typography>
                                }
                                sx={{ margin: 0, padding: '2px 0' }}
                              />
                            ))}
                        </Box>
                      </ListItem>
                    </List>
                  </>
                )}
              </Grid>
            ))}
          </Box>
          {/* </div> */}
        </Grid>

        {/* Right column - Table section */}
        <Grid item xs={12} md={9.7} sx={{ flex: '1 1 auto' }}>
          <div style={{ overflowX: 'auto' }}>
            <TableContainer
              component={Paper}
              className={styles.tableContainer}
              style={{
                maxHeight: '100%',
                height: '100%',
                minWidth: '100%',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell
                        key={column.field}
                        style={{
                          backgroundColor: '#E5E7EB',
                          color: 'black',
                          border: '2px solid #f0f0f0',
                          // whiteSpace: 'nowrap',
                          paddingTop: 1,
                          paddingBottom: 1,
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          // maxWidth: column.width || 'auto',
                          // minWidth: '80px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            lineHeight: '1.3',
                            padding: '6px 0px',
                          }}
                          onClick={() => handleSort(column.field)}
                        >
                          {convertPascalToTitleCase(column.headerName)}
                          {/* {column.sortable && ( */}
                          <span>
                            {sorting.field === column.field ? (
                              sorting.order === 'asc' ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : (
                              <SwapVertIcon />
                            )}
                          </span>
                          {/* )} */}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <div style={{ height: '400px' }}>
                          <CircularProgress />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <Typography color="error">Error: {error}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : productDetails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <Typography>No products found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedRows.map((row, index) => (
                      <TableRow key={row.ProductId} className={styles.tableRow}>
                        {columns.map(column => (
                          <TableCell
                            key={column.field}
                            align="left"
                            style={{
                              border: '1.5px solid #f0f0f0',
                              fontSize: '0.7rem', // Smaller font size
                              padding: '0 0.5% 0 0.5%',
                              // whiteSpace: 'normal',
                              // wordBreak: 'break-word', // Break long words
                              overflow: 'visible', // Ensure overflow is visible if needed
                            }}
                          >
                            {column.renderCell
                              ? column.renderCell({ value: row[column.field] || '-', row })
                              : column.field === 'price'
                              ? row[column.field]
                                ? `$${parseFloat(row[column.field]).toFixed(2)}`
                                : '-'
                              : row[column.field] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* <ProductTable productDetails={productDetails} handleSearch={handleSearch} handleAscSort={handleAscSort} handleDescSort={handleDescSort}/> */}

          {totalRows > 0 && (
            <CustomPagination
              totalRows={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={newPage => setPage(newPage)}
              onRowsPerPageChange={newRowsPerPage => {
                setRowsPerPage(newRowsPerPage)
                setPage(0)
              }}
            />
          )}
        </Grid>
      </Grid>
      <div style={{ marginTop: '40px', marginLeft: '-5px' }}>.</div>
    </>
    // <>
    //   {/* <Box
    //   sx={{
    //     bgcolor: '#113163',
    //     py: 3,
    //     width: '100%',
    //     marginBottom: '5px',
    //     display: 'flex',
    //     flexDirection: 'column',
    //   }}
    // > */}
    //   <Box
    //     sx={{
    //       overflow: 'hidden',
    //       display: 'flex',
    //       flexDirection: 'column',
    //       position: 'relative',
    //       backgroundColor: '#113163',
    //       padding: '10px 20px',
    //       height: '6rem',
    //       '@media (min-width: 1300px)': {
    //         left: '50%',
    //         right: '50%',
    //         marginLeft: '-50vw',
    //         marginRight: '-50vw',
    //         width: '99.3vw',
    //       },
    //     }}
    //   >
    //     <Box
    //       sx={{
    //         maxWidth: '1350px',
    //         margin: '0 auto',
    //         width: '100%',
    //         display: 'flex',
    //         flexDirection: 'column',
    //       }}
    //     >
    //       <Box
    //         sx={{
    //           marginLeft: '2rem',
    //           marginTop: '1rem',
    //           display: 'flex',
    //           alignItems: 'center',
    //           justifyContent: 'space-between',
    //           px: 2,
    //           flexWrap: 'wrap',
    //         }}
    //       >
    //         <Typography
    //           variant="h5"
    //           sx={{
    //             color: 'white',
    //             flexGrow: 1,
    //             fontSize: '1.8rem',
    //             overflow: 'hidden',
    //             textOverflow: 'ellipsis',
    //             display: '-webkit-box',
    //             WebkitBoxOrient: 'vertical',
    //             WebkitLineClamp: 1,
    //             maxWidth: '100%',
    //           }}
    //         >
    //           {categoryName}
    //         </Typography>

    //         <Box
    //           sx={{
    //             display: 'flex',
    //             alignItems: 'center',
    //             flexWrap: 'wrap',
    //             justifyContent: 'center',
    //             flexGrow: 1,
    //             marginTop: { xs: '0.5rem', md: '0' },
    //             minWidth: '0',
    //           }}
    //         >
    //           <Link href="/" sx={{ textDecoration: 'none' }}>
    //             <Typography
    //               variant="body1"
    //               sx={{
    //                 color: '#d1d5db',
    //                 fontSize: '0.75rem',
    //                 textDecoration: 'none',
    //                 '&:hover': {
    //                   color: 'white',
    //                 },
    //               }}
    //             >
    //               Home
    //             </Typography>
    //           </Link>
    //           <Typography
    //             variant="body1"
    //             sx={{
    //               color: '#d1d5db',
    //               mx: 0.2,
    //               fontSize: '0.75rem',
    //               display: 'flex',
    //               alignItems: 'center',
    //             }}
    //           >
    //             <ArrowRightIcon fontSize="small" />
    //           </Typography>
    //           <Link href="/manufacturers" sx={{ textDecoration: 'none' }}>
    //             <Typography
    //               variant="body1"
    //               sx={{
    //                 color: '#d1d5db',
    //                 fontSize: '0.75rem',
    //                 textDecoration: 'none',
    //                 '&:hover': {
    //                   color: 'white',
    //                 },
    //               }}
    //             >
    //               Manufacturers
    //             </Typography>
    //           </Link>
    //           <Typography
    //             variant="body1"
    //             sx={{
    //               color: '#d1d5db',
    //               mx: 0.2,
    //               fontSize: '0.75rem',
    //               display: 'flex',
    //               alignItems: 'center',
    //             }}
    //           >
    //             <ArrowRightIcon fontSize="small" />
    //           </Typography>

    //           <Link href={`/manufacturer/${manufacturerName.slug}`} sx={{ textDecoration: 'none' }}>
    //             {/* <Tooltip title={manufacturerName.name} arrow> */}
    //             <Typography
    //               variant="body1"
    //               sx={{
    //                 color: '#d1d5db',
    //                 fontSize: '0.75rem',
    //                 overflow: 'hidden',
    //                 textOverflow: 'ellipsis',
    //                 display: '-webkit-box',
    //                 WebkitBoxOrient: 'vertical',
    //                 WebkitLineClamp: 1,
    //                 maxWidth: '100%',
    //                 minWidth: '0',
    //               }}
    //             >
    //               {manufacturerName.name}
    //             </Typography>
    //             {/* </Tooltip> */}
    //           </Link>
    //           <Typography
    //             variant="body1"
    //             sx={{
    //               color: '#d1d5db',
    //               mx: 0.2,
    //               fontSize: '0.75rem',
    //               display: 'flex',
    //               alignItems: 'center',
    //             }}
    //           >
    //             <ArrowRightIcon fontSize="small" />
    //           </Typography>

    //           {/* <Tooltip title={categoryName} arrow> */}
    //           <Typography
    //             variant="body1"
    //             sx={{
    //               color: 'white',
    //               fontSize: '0.75rem',
    //               overflow: 'hidden',
    //               textOverflow: 'ellipsis',
    //               display: '-webkit-box',
    //               WebkitBoxOrient: 'vertical',
    //               WebkitLineClamp: 1,
    //               maxWidth: '100%',
    //               minWidth: '0',
    //             }}
    //           >
    //             {categoryName}
    //           </Typography>
    //           {/* </Tooltip> */}
    //         </Box>
    //       </Box>
    //     </Box>
    //   </Box>
    //   <Box sx={{ padding: 2, overflowX: 'auto' }}>
    //     <Grid container spacing={2}>
    //       <Grid item>
    //         <TextField
    //           variant="outlined"
    //           size="small"
    //           placeholder="Search within"
    //           value={searchBarValue}
    //           onChange={event => setSearchBarValue(event.target.value)}
    //           inputProps={{ style: { fontSize: 15 } }}
    //           InputLabelProps={{ style: { fontSize: 10 } }}
    //           sx={{ mb: 2 }}
    //           InputProps={{
    //             endAdornment: (
    //               <IconButton
    //                 type="submit"
    //                 aria-label="search"
    //                 onClick={event => handleSearch(event, false)}
    //                 disabled={loading}
    //               >
    //                 {/* <SearchIcon /> */}
    //                 {loading && searchQuery ? (
    //                   <CircularProgress size={20} sx={{ color: 'grey' }} />
    //                 ) : (
    //                   <SearchIcon />
    //                 )}
    //               </IconButton>
    //             ),
    //           }}
    //         />
    //       </Grid>
    //       <Grid item>
    //         <Typography component="span" sx={{ fontSize: '0.8rem' }}>
    //           Results:{' '}
    //         </Typography>
    //         <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
    //           {loading ? <CircularProgress /> : totalRows}
    //         </Typography>
    //       </Grid>
    //     </Grid>

    //     {loadingCatData ? (
    //       <Box sx={horizontalScroll}>
    //         <Grid container spacing={1} sx={{ flexWrap: 'nowrap', marginBottom: '1%' }}>
    //           {fixedCategoriesData.length > 0 ? (
    //             fixedCategoriesData.map((_, index) => (
    //               <Grid item key={`placeholder-fixed-${index}`}>
    //                 <Box
    //                   sx={{
    //                     width: '100%',
    //                     height: '310px',
    //                     display: 'flex',
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                     backgroundColor: '#f0f0f0',
    //                   }}
    //                 />
    //               </Grid>
    //             ))
    //           ) : (
    //             <Grid item>
    //               <Box
    //                 sx={{
    //                   width: '100%',
    //                   height: '310px',
    //                   display: 'flex',
    //                   justifyContent: 'center',
    //                   alignItems: 'center',
    //                   backgroundColor: '#f0f0f0',
    //                 }}
    //               />
    //             </Grid>
    //           )}
    //           {categoriesData.length > 0 ? (
    //             categoriesData.map((_, index) => (
    //               <Grid item key={`placeholder-${index}`}>
    //                 <Box
    //                   sx={{
    //                     width: '100%',
    //                     height: '310px',
    //                     display: 'flex',
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                     backgroundColor: '#f0f0f0',
    //                   }}
    //                 />
    //               </Grid>
    //             ))
    //           ) : (
    //             <Grid item>
    //               <Box
    //                 sx={{
    //                   width: '100%',
    //                   height: '310px',
    //                   display: 'flex',
    //                   justifyContent: 'center',
    //                   alignItems: 'center',
    //                   backgroundColor: '#f0f0f0',
    //                 }}
    //               />
    //             </Grid>
    //           )}
    //         </Grid>
    //       </Box>
    //     ) : (
    //       <Box sx={horizontalScroll}>
    //         <Grid container spacing={1} sx={{ flexWrap: 'nowrap', marginBottom: '1%' }}>
    //           {fixedCategoriesData.map(category => (
    //             <Grid item key={category.id}>
    //               <List sx={style}>
    //                 <ListItem>
    //                   <Typography
    //                     sx={{ whiteSpace: 'nowrap', fontSize: '95%', fontWeight: 'bold' }}
    //                   >
    //                     {category.name}
    //                   </Typography>
    //                 </ListItem>
    //                 <Divider component="li" />
    //                 {category.options.length > 14 && (
    //                   <ListItem>
    //                     <TextField
    //                       variant="outlined"
    //                       size="small"
    //                       inputProps={{ style: { fontSize: 14 } }}
    //                       InputLabelProps={{ style: { fontSize: 10 } }}
    //                       placeholder="Search within"
    //                       onChange={e =>
    //                         handleSearchInputChangeFixed(category.name, e.target.value)
    //                       }
    //                       sx={{ width: '100%', minWidth: '140px' }}
    //                     />
    //                   </ListItem>
    //                 )}
    //                 <ListItem>
    //                   <Box sx={{ ...scroll, height: category.options.length > 14 ? 255 : 310 }}>
    //                     {category.options
    //                       .filter(option => {
    //                         const searchTermFixed = searchTermsFixed[category.name] || ''
    //                         return (
    //                           option.value && option.value.toLowerCase().includes(searchTermFixed)
    //                         )
    //                       })
    //                       .map(option => (
    //                         <Typography
    //                           key={option.id}
    //                           sx={{
    //                             whiteSpace: 'nowrap',
    //                             cursor:
    //                               Object.keys(selectedCategories).length === 0 ||
    //                               isFixedOptionEnabled(category.name, option.id)
    //                                 ? 'pointer'
    //                                 : 'not-allowed',
    //                             backgroundColor: (
    //                               selectedCategories[category.id]?.values || []
    //                             ).includes(option.id)
    //                               ? 'lightblue'
    //                               : 'transparent',
    //                             borderRadius: '4px',
    //                             fontSize: '85%',
    //                             opacity:
    //                               Object.keys(selectedCategories).length === 0 ||
    //                               isFixedOptionEnabled(category.name, option.id)
    //                                 ? 1
    //                                 : 0.5,
    //                           }}
    //                           onClick={() =>
    //                             (Object.keys(selectedCategories).length === 0 ||
    //                               isFixedOptionEnabled(category.name, option.id)) &&
    //                             handleSelectionChange(category.id, option.id, category.name)
    //                           }
    //                         >
    //                           {option.value}
    //                         </Typography>
    //                       ))}
    //                   </Box>
    //                 </ListItem>
    //               </List>
    //             </Grid>
    //           ))}
    //           {categoriesData.map(category => (
    //             <Grid item key={category.id}>
    //               <List sx={style}>
    //                 <ListItem>
    //                   <Typography
    //                     sx={{ whiteSpace: 'nowrap', fontSize: '95%', fontWeight: 'bold' }}
    //                   >
    //                     {category.name}
    //                   </Typography>
    //                 </ListItem>
    //                 <Divider component="li" />
    //                 {category.options.length > 14 && (
    //                   <ListItem>
    //                     <TextField
    //                       variant="outlined"
    //                       size="small"
    //                       inputProps={{ style: { fontSize: 14 } }}
    //                       InputLabelProps={{ style: { fontSize: 10 } }}
    //                       placeholder="Search within"
    //                       value={searchTerms[category.id] || ''}
    //                       onChange={e => handleSearchInputChange(category.id, e.target.value)}
    //                       sx={{ width: '100%', minWidth: '140px' }}
    //                     />
    //                   </ListItem>
    //                 )}
    //                 <ListItem>
    //                   <Box sx={{ ...scroll, height: category.options.length > 14 ? 255 : 310 }}>
    //                     {category.options
    //                       .filter(option => {
    //                         const searchTerm = searchTerms[category.id] || ''
    //                         return option.value.toLowerCase().includes(searchTerm)
    //                       })
    //                       .map(option => (
    //                         <Typography
    //                           key={option.id}
    //                           sx={{
    //                             whiteSpace: 'nowrap',
    //                             cursor:
    //                               Object.keys(selectedCategories).length === 0 ||
    //                               isOptionEnabled(category.id, option.id)
    //                                 ? 'pointer'
    //                                 : 'not-allowed',
    //                             backgroundColor: (
    //                               selectedCategories[category.id]?.values || []
    //                             ).includes(option.id)
    //                               ? 'lightblue'
    //                               : 'transparent',
    //                             borderRadius: '4px',
    //                             fontSize: '85%',
    //                             opacity:
    //                               Object.keys(selectedCategories).length === 0 ||
    //                               isOptionEnabled(category.id, option.id)
    //                                 ? 1
    //                                 : 0.5,
    //                           }}
    //                           onClick={() =>
    //                             (Object.keys(selectedCategories).length === 0 ||
    //                               isOptionEnabled(category.id, option.id)) &&
    //                             handleSelectionChange(category.id, option.id, category.name)
    //                           }
    //                         >
    //                           {option.value}
    //                         </Typography>
    //                       ))}
    //                   </Box>
    //                 </ListItem>
    //               </List>
    //             </Grid>
    //           ))}
    //         </Grid>
    //       </Box>
    //     )}
    //   </Box>

    //   {/* ----------------------------------- Buttons ------------------------------------------------------ */}
    //   <Box sx={{ padding: 2, marginBottom: 4, marginTop: -3 }}>
    //     <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 2 }} />

    //     <Grid container spacing={1}>
    //       <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    //         <StyledButton
    //           variant="contained"
    //           sx={{
    //             height: '2.5rem',
    //             whiteSpace: 'nowrap',
    //             fontSize: '0.8rem',
    //             color: Object.keys(selectedCategories).length === 0 ? 'default' : 'black',
    //             backgroundColor:
    //               Object.keys(selectedCategories).length === 0 ? 'default' : '#F5D949',
    //             '&:hover': {
    //               backgroundColor:
    //                 Object.keys(selectedCategories).length === 0 ? 'default' : '#113163',
    //               color: 'white',
    //             },
    //           }}
    //           disabled={Object.keys(selectedCategories).length === 0 || (filterApplied && loading)}
    //           onClick={handleApplyClick}
    //         >
    //           {/* Apply */}
    //           {filterApplied && loading ? (
    //             <>
    //               <CircularProgress size={20} sx={{ color: 'white', marginRight: '0.5rem' }} />
    //               Applying
    //             </>
    //           ) : (
    //             'Apply'
    //           )}
    //         </StyledButton>
    //         <StyledButton
    //           variant="contained"
    //           sx={{
    //             height: '2.5rem',
    //             whiteSpace: 'nowrap',
    //             color: isClearDisabled() ? 'default' : 'black',
    //             backgroundColor: isClearDisabled() ? 'default' : 'white',
    //             '&:hover': {
    //               backgroundColor: isClearDisabled() ? 'default' : '#e0e0e0',
    //             },
    //           }}
    //           onClick={handleClearFilters}
    //           disabled={isClearDisabled() || (filterApplied && loading)}
    //         >
    //           Clear
    //         </StyledButton>
    //       </Grid>
    //     </Grid>
    //   </Box>

    //   {/* ---------------------------Filtered Display Products--------------------------------------------  */}
    //   <div className={styles.headingProductContainer}>
    //     <div className={styles.headingProduct}>
    //       <div id="headerFont">
    //         Available {categoryName.replace(/Products/, '').trim()} Products
    //       </div>
    //     </div>
    //   </div>
    //   <div style={{ overflowX: 'auto' }}>
    //     <TableContainer
    //       component={Paper}
    //       className={styles.tableContainer}
    //       style={{
    //         maxHeight: '100%',
    //         height: '100%',
    //         minWidth: '100%',
    //       }}
    //     >
    //       <Table>
    //         <TableHead>
    //           <TableRow>
    //             {columns.map(column => (
    //               <TableCell
    //                 key={column.field}
    //                 style={{
    //                   backgroundColor: '#1A1552',
    //                   color: 'white',
    //                   border: '2px solid #f0f0f0',
    //                   whiteSpace: 'nowrap',
    //                   paddingTop: 8,
    //                   paddingBottom: 8,
    //                   fontSize: '0.6rem',
    //                   maxWidth: column.width || 'auto',
    //                   textAlign: 'center',
    //                 }}
    //               >
    //                 {/* {column.headerName === 'price' ? (
    //                   <>
    //                     <div>Price</div>
    //                     {/* <TextField
    //                       variant="outlined"
    //                       size="small"
    //                       placeholder={`Search by Price`}
    //                       fullWidth
    //                       onChange={(event) => handleSearch(event, true)}
    //                       InputProps={{
    //                         style: {
    //                           backgroundColor: '#f0f0f0',
    //                           fontSize: '0.6rem',
    //                         },
    //                       }}
    //                       style={{ marginTop: 5, width: '140px' }}
    //                     />
    //                     <TextField
    //                       variant="outlined"
    //                       size="small"
    //                       placeholder={`Search by Price`}
    //                       fullWidth
    //                       // onChange={(event) => handleSearch(event.target.value, true)}
    //                       //onKeyDown={(event) => {
    //                       //   if (event.key === 'Enter') {
    //                       //     const value = event.target.value.replace(/\$/g, '');
    //                       //     handleSearch(value, true);
    //                       //   }
    //                       // }}
    //                       onKeyDown={event => {
    //                         // Allow only numbers, backspace, delete, arrow keys
    //                         const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight']

    //                         if (
    //                           !allowedKeys.includes(event.key) &&
    //                           (isNaN(Number(event.key)) || event.key === ' ')
    //                         ) {
    //                           event.preventDefault()
    //                         }

    //                         if (event.key === 'Enter') {
    //                           const value = event.target.value.replace(/\$/g, '')
    //                           handleSearch(value, true)
    //                         }
    //                       }}
    //                       InputProps={{
    //                         style: {
    //                           backgroundColor: '#f0f0f0',
    //                           fontSize: '0.6rem',
    //                         },
    //                       }}
    //                       style={{ marginTop: 5, width: '140px' }}
    //                     />
    //                   </>
    //                 ) : ( */}
    //                 {convertPascalToTitleCase(column.headerName)}
    //               </TableCell>
    //             ))}
    //           </TableRow>
    //           <TableRow>
    //             {columns.map(column => (
    //               <TableCell
    //                 key={column.field}
    //                 width={column.width}
    //                 style={{
    //                   backgroundColor: '#1A1552',
    //                   color: 'white',
    //                   padding: '0',
    //                   border: '2px solid #f0f0f0',
    //                   position: 'relative',
    //                   overflow: 'hidden',
    //                 }}
    //               >
    //                 {column.sortable && (
    //                   <div
    //                     style={{
    //                       display: 'flex',
    //                       alignItems: 'center',
    //                       justifyContent: 'space-around',
    //                       height: '100%',
    //                       padding: '0 8px',
    //                     }}
    //                   >
    //                     <IconButton
    //                       style={{
    //                         paddingTop: '0',
    //                         paddingBottom: '0',
    //                       }}
    //                       onClick={() => handleAscSort(column.field)}
    //                     >
    //                       <KeyboardArrowUp
    //                         style={{
    //                           backgroundColor: '#1A1552',
    //                           color: 'white',
    //                           scale: '0.8',
    //                         }}
    //                       />
    //                     </IconButton>
    //                     <div
    //                       style={{
    //                         height: '4.5vh',
    //                         borderLeft: '1px solid #f0f0f0',
    //                       }}
    //                     />
    //                     <IconButton
    //                       style={{
    //                         paddingTop: '0',
    //                         paddingBottom: '0',
    //                       }}
    //                       onClick={() => handleDescSort(column.field)}
    //                     >
    //                       <KeyboardArrowDown
    //                         style={{
    //                           backgroundColor: '#1A1552',
    //                           color: 'white',
    //                           scale: '0.8',
    //                         }}
    //                       />
    //                     </IconButton>
    //                   </div>
    //                 )}
    //               </TableCell>
    //             ))}
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {loading ? (
    //             <TableRow>
    //               <TableCell colSpan={columns.length} align="center">
    //                 <CircularProgress />
    //               </TableCell>
    //             </TableRow>
    //           ) : error ? (
    //             <TableRow>
    //               <TableCell colSpan={columns.length} align="center">
    //                 <Typography color="error">Error: {error}</Typography>
    //               </TableCell>
    //             </TableRow>
    //           ) : productDetails.length === 0 ? (
    //             <TableRow>
    //               <TableCell colSpan={columns.length} align="center">
    //                 <Typography>No products found.</Typography>
    //               </TableCell>
    //             </TableRow>
    //           ) : (
    //             sortedRows.map((row, index) => (
    //               <TableRow key={row.ProductId} className={styles.tableRow}>
    //                 {/* <TableCell
    //                   style={{
    //                     border: '1.5px solid #f0f0f0',
    //                     fontSize: '0.7rem',
    //                     padding: '0 0.5% 0 1.5%',
    //                   }}
    //                 >
    //                   {page * rowsPerPage + index + 1}.
    //                 </TableCell> */}
    //                 {columns.map(column => (
    //                   <TableCell
    //                     key={column.field}
    //                     align="left"
    //                     style={{
    //                       border: '1.5px solid #f0f0f0',
    //                       fontSize: '0.7rem',
    //                       padding: '0 0.5% 0 0.5%',
    //                       whiteSpace: 'normal',
    //                       wordBreak: 'break-word',
    //                       overflow: 'visible',
    //                     }}
    //                   >
    //                     {column.renderCell
    //                       ? column.renderCell({ value: row[column.field] || '-', row })
    //                       : column.field === 'price'
    //                       ? row[column.field]
    //                         ? `$${parseFloat(row[column.field]).toFixed(2)}`
    //                         : '-'
    //                       : row[column.field] || '-'}
    //                   </TableCell>
    //                 ))}
    //               </TableRow>
    //             ))
    //           )}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //   </div>

    //   {totalRows > 0 && (
    //     <CustomPagination
    //       totalRows={totalRows}
    //       rowsPerPage={rowsPerPage}
    //       page={page}
    //       onPageChange={newPage => setPage(newPage)}
    //       onRowsPerPageChange={newRowsPerPage => {
    //         setRowsPerPage(newRowsPerPage)
    //         setPage(0)
    //       }}
    //     />
    //   )}
    //   <div style={{ marginTop: '40px', marginLeft: '-5px' }}>.</div>
    // </>
  )
}

export default Grids
