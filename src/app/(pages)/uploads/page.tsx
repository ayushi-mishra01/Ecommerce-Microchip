'use client'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  Link
} from '@mui/material'
import axios from 'axios'

import CustomPagination from './CustomPagination'

import styles from './index.module.scss'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { ExpandMore, ExpandLess } from '@mui/icons-material'

const excludedFields = [
  'productId',
  'shortDescription',
  'description',
  'stockQuantity',
  'rohsStatus',
  'series',
  'price',
  'packaging',
  'manufacturerName',
  'manufacturerSlug',
  'manufacturerLeadTime',
  'categoryName',
  'productStatus',
  'displayPosition',
  'sku',
  'categoryId',
  'categorySlug',
  'inventoryTypeId',
  'productCategories',
  'productParameters',
  'productPictures',
  'manufacturerId',
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
]

const UploadedItems = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [searchQuery, setSearchQuery] = useState('')
  const [sorting, setSorting] = useState({
    field: '',
    order: 'asc',
  })
  const [productDetails, setProductDetails] = useState([])
  const [notPresentProducts, setNotPresentProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [priceSearchQuery, setPriceSearchQuery] = useState('')
  const [fileData, setFileData] = useState([])

  const handleRemoveName = (nameToRemove: string) => {
    const updatedDetails = notPresentProducts.filter(product => product.name !== nameToRemove)
    setNotPresentProducts(updatedDetails)
    localStorage.setItem('notPresentNames', JSON.stringify(updatedDetails))
  }

  const getProductsByNames = async presentData => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/getProductsByNames`,
        //`https://localhost:7053/api/Products/getProductsByNames`,
        presentData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      console.log('Products by names:', response.data)
      setProductDetails(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products by names:', error)
      setError('Failed to fetch products')
      setLoading(false)
    }
  }
  const rfq = partNumber => {
    localStorage.setItem('partNumber', partNumber)
    window.location.href = `/rfq`
  }

  const allrfq = () => {
    localStorage.setItem('notPresentNames', JSON.stringify(notPresentProducts))
    window.location.href = `/rfq`
  }

  useEffect(() => {
    const fd = JSON.parse(localStorage.getItem('fileData') || '[]')
    setFileData(fd)
    document.title = 'Uploads'
  }, [])

  useEffect(() => {
    const prepareData = () => {
      const cleanedData = fileData.map(row => JSON.stringify(row).replace(/^\["|"\]$/g, ''))
      const concatenatedData = cleanedData.join('^')
      console.log(concatenatedData)
      return concatenatedData
    }

    const checkPresence = async () => {
      const concatenatedData = prepareData()

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/getProductPresence`,
          concatenatedData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const { present } = response.data
        const { notPresent } = response.data

        if (present) {
          await getProductsByNames(present)
        }
        if (notPresent) {
          const stringValue = notPresent
          const resultArray = stringValue.split('^').map(value => value.trim())
          const resultArrayOfObjects = resultArray
            .map((value, index) => ({ name: value }))
            .filter(obj => obj.name !== '')
          setNotPresentProducts(resultArrayOfObjects)
          // localStorage.setItem('notPresentNames', JSON.stringify(resultArrayOfObjects));
          setProductDetails(productDetails => [...productDetails, ...resultArrayOfObjects])
        }
      } catch (error) {
        console.error('Error:', error)
        setError('Failed to check product presence')
      } finally {
        setLoading(false)
      }
    }
    checkPresence()
  }, [fileData])

  const convertPascalToTitleCase = text => {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  const firstRecord = productDetails[0] || {}
  const columns = [
    { field: 's.no.', headerName: 'S.No.' },
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
              // onError={e => {
              //   e.target.onerror = null
              //   e.target.src =
              //     'https://www.microchipusa.com/wp-content/uploads/2023/07/THS7353PW.jpg'
              // }}
            />
          </Grid>
          <Grid item xs zeroMinWidth>
            <div
              style={{
                overflow: 'visible',
                whiteSpace: 'nowrap',
                cursor: params.row.shortDescription ? 'pointer' : null,
                color: '#2563EB',
                fontWeight: 'bold',
              }}
              onClick={() => {
                if (params.row.shortDescription) {
                  // window.location.href = `/product/${params.row.manufacturerSlug}/${params.row.categorySlug}/${params.row.sku}`
                  window.open(
                    `/product/${params.row.manufacturerSlug}/${params.row.categorySlug}/${params.row.sku}`,
                    '_blank',
                  )
                }
              }}
            >
              {params.row.name}
              {!params.row.shortDescription && (
                <span
                  style={{
                    marginLeft: '25%',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    rfq(params.row.name)
                  }}
                >
                  Not Found : Request Quote
                </span>
              )}
            </div>
            {params.row.shortDescription ? (
              <div style={{ marginTop: '2px', marginRight: '10px', fontSize: '0.6rem' }}>
                {params.row.shortDescription}
              </div>
            ) : null}
          </Grid>
        </Grid>
      ),
    },
    {
      field: 'manufacturerName',
      headerName: 'Manufacturer',
      sortable: true,
      renderCell: params => (
        <div
          style={{
            cursor: 'pointer',
            color: '#2563EB',
          }}
          onClick={() => {
            // window.location.href = `/manufacturer/${params.row.manufacturerSlug}`
            window.open(
             `/manufacturer/${params.row.manufacturerSlug}`,
              '_blank',
            )
          }}
        >
          {params.row.manufacturerName}
        </div>
      ),
    },
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

  const handleChangePage = newPage => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = newRowsPerPage => {
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  const handleSearch = (event, isPriceSearch = false) => {
    if (isPriceSearch) {
      setPriceSearchQuery(event.target.value)
    } else {
      setSearchQuery(event.target.value)
    }
  }

  const filteredRows = productDetails.filter(row => {
    if (priceSearchQuery) {
      return row.price && String(row.price).toLowerCase().includes(priceSearchQuery.toLowerCase())
    } else {
      return row.name && row.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
  })

  const sortedRows = filteredRows.sort((a, b) => {
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

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
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
            '@media (min-width:1300px)': {
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
                Uploads
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '20rem',
                  // justifyContent: 'flex-end'
                }}
              >
                <Link href="/">
                  <Button
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
                <Typography
                  variant="body1"
                  sx={{
                    color: '#d1d5db',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ArrowRightIcon fontSize="small" />
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'white',
                    fontSize: '0.75rem',
                    p: 0,
                  }}
                >
                  Uploads
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: '20px' }}>
          <Typography variant="h5" color="text.secondary">
            Uploaded Products
          </Typography>
        </Box>
        {productDetails.length > 0 ? (
          // <div style={{ overflowX: 'auto' }}>
          //   <TableContainer
          //     component={Paper}
          //     className={styles.tableContainer}
          //     style={{
          //       maxHeight: '100%',
          //       height: '100%',
          //       minWidth: '100%',
          //     }}
          //   >
          //     <Table>
          //       <TableHead>
          //         <TableRow>
          //           {columns.map(column => (
          //             <TableCell
          //               key={column.field}
          //               style={{
          //                 backgroundColor: '#1A1552',
          //                 color: 'white',
          //                 border: '2px solid #f0f0f0',
          //                 whiteSpace: 'nowrap',
          //                 paddingTop: 8,
          //                 paddingBottom: 8,
          //                 fontSize: '0.6rem',
          //                 maxWidth: 'auto',
          //                 textAlign: 'center',
          //               }}
          //             >
          //               {convertPascalToTitleCase(column.headerName)}
          //             </TableCell>
          //           ))}
          //         </TableRow>
          //       </TableHead>
          //       <TableBody>
          //         {loading ? (
          //           <TableRow>
          //             <TableCell colSpan={columns.length} align="center">
          //               <CircularProgress />
          //             </TableCell>
          //           </TableRow>
          //         ) : error ? (
          //           <TableRow>
          //             <TableCell colSpan={columns.length} align="center">
          //               <Typography color="error">Error: {error}</Typography>
          //             </TableCell>
          //           </TableRow>
          //         ) : (
          //           productDetails
          //             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          //             .map((row, index) => (
          //               <TableRow key={row.productId} className={styles.tableRow}>
          //                 <TableCell
          //                   style={{
          //                     border: '1.5px solid #f0f0f0',
          //                     fontSize: '0.7rem',
          //                     padding: '0 0.5% 0 1.5%',
          //                   }}
          //                 >
          //                   {page * rowsPerPage + index + 1}.
          //                 </TableCell>
          //                 {columns.slice(1).map(column => (
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
          //                     {/* @ts-expect-error */}
          //                     {column.renderCell /* @ts-expect-error */
          //                       ? column.renderCell({ value: row[column.field] || '-', row })
          //                       : row[column.field] || '-'}
          //                   </TableCell>
          //                 ))}
          //               </TableRow>
          //             ))
          //         )}
          //       </TableBody>
          //     </Table>
          //   </TableContainer>
          // </div>
          <div style={{ overflowX: 'auto', padding: '0 15px' }}>
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
                          whiteSpace: 'nowrap',
                          paddingTop: 6,
                          paddingBottom: 6,
                          fontSize: '0.75rem',
                          fontWeight: '500',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
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
                        <CircularProgress />
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
                        <TableCell
                          style={{
                            border: '1.5px solid #f0f0f0',
                            fontSize: '0.7rem',
                            padding: '0 0.5% 0 1.5%',
                          }}
                        >
                          {page * rowsPerPage + index + 1}.
                        </TableCell>
                        {columns.slice(1).map(column => (
                          <TableCell
                            key={column.field}
                            align="left"
                            style={{
                              border: '1.5px solid #f0f0f0',
                              fontSize: '0.7rem',
                              padding: '0 0.5% 0 0.5%',
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              overflow: 'visible',
                            }}
                          >{/* @ts-expect-error */}
                            {column.renderCell  /* @ts-expect-error */
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

            <CustomPagination
              totalRows={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        ) : (
          !loading && (
            <Typography align="center" variant="h6" style={{ marginTop: '20px' }}>
              No products available
            </Typography>
          )
        )}

        {notPresentProducts.length > 1 ? (
          <Paper elevation={3} sx={{ padding: '2%', margin: '2%' }}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h4" color="text.secondary">
                Request for Quote
              </Typography>
            </Box>
            <Grid container spacing={2} mt={2}>
              {notPresentProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={3}
                    sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '10px' }}
                  >
                    <Typography variant="body2" mt={1.4} ml={0.4}>
                      {product.name}
                    </Typography>
                    <IconButton aria-label="remove" onClick={() => handleRemoveName(product.name)}>
                      <CloseIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#f5d949',
                  color: 'black',
                  fontSize: '12px',
                  '&:hover': {
                    backgroundColor: '#113163',
                    color: 'white',
                  },
                }}
                onClick={() => allrfq()}
              >
                Request For Quote
              </Button>
            </Box>
          </Paper>
        ) : null}
      </div>
    </>
  )
}

export default UploadedItems
