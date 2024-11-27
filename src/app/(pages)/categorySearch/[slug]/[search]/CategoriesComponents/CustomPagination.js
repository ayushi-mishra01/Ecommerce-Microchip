'use client'
import React, { useState } from 'react'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, MenuItem, Select, useMediaQuery } from '@mui/material'

const CustomPagination = ({ totalRows, rowsPerPage, page, onPageChange, onRowsPerPageChange }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const [rowsPerPageOptions] = useState([25, 50, 100])
  const isSmallScreen = useMediaQuery('(max-width: 600px)')

  const visiblePageCount = isSmallScreen ? 3 : 5
  let startPage = Math.max(0, page - Math.floor(visiblePageCount / 2))
  let endPage = Math.min(totalPages - 1, startPage + visiblePageCount - 1)

  if (endPage - startPage + 1 < visiblePageCount) {
    startPage = Math.max(0, endPage - visiblePageCount + 1)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isSmallScreen ? 'center' : 'flex-start',
        gap: isSmallScreen ? '10px' : '20px',
        marginTop: '20px',
        fontFamily: 'Arial, sans-serif',
        border: 'none',
        width: '100%',
      }}
    >
      <Box
        sx={{
          fontSize: '0.9rem',
          textAlign: isSmallScreen ? 'center' : 'left',
        }}
      >
        Showing {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, totalRows)} of{' '}
        {totalRows}
        <Select
          value={rowsPerPage}
          onChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
          sx={{
            marginLeft: isSmallScreen ? '0' : '10px',
            marginTop: isSmallScreen ? '10px' : '0',
            background: 'transparent',
            border: 'none',
            '& .MuiSelect-select': {
              fontWeight: 'bold',
            },
          }}
        >
          {rowsPerPageOptions.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
          gap: '5px',
        }}
      >
        {page > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <FirstPageIcon />
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <NavigateBeforeIcon />
            </button>
          </>
        )}

        {[...Array(endPage - startPage + 1)].map((_, index) => (
          <button
            key={startPage + index}
            onClick={() => onPageChange(startPage + index)}
            style={{
              backgroundColor: page === startPage + index ? '#F5D949' : 'transparent',
              color: 'black',
              margin: '0 5px',
              padding: '5px 10px',
              borderRadius: '2px',
              border: 'none',
              cursor: 'pointer',
              minWidth: '30px',
              textAlign: 'center',
              fontWeight: page === startPage + index ? 'bold' : 'normal',
            }}
          >
            {startPage + index + 1}
          </button>
        ))}

        {page < totalPages - 1 && (
          <>
            <button
              onClick={() => onPageChange(page + 1)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <NavigateNextIcon />
            </button>
            <button
              onClick={() => onPageChange(totalPages - 1)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <LastPageIcon />
            </button>
          </>
        )}
      </Box>
    </Box>
  )
}

export default CustomPagination
