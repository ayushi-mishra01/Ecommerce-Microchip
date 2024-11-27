'use client'
import React, { useState } from 'react'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, MenuItem, Select } from '@mui/material'

const CustomPagination = ({ totalRows, rowsPerPage, page, onPageChange, onRowsPerPageChange }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const [rowsPerPageOptions] = useState([25, 50, 100])

  // Determine the range of page numbers to display
  const visiblePageCount = 5
  let startPage = Math.max(0, page - Math.floor(visiblePageCount / 2))
  let endPage = Math.min(totalPages - 1, startPage + visiblePageCount - 1)

  // Adjust the start page if end page is less than total visible pages
  if (endPage - startPage + 1 < visiblePageCount) {
    startPage = Math.max(0, endPage - visiblePageCount + 1)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px',
        marginLeft: '20px',
        fontFamily: 'Arial, sans-serif',
        border: 'none',
      }}
    >
      <div style={{ marginRight: '20px', fontSize: '0.9rem' }}>
        Showing {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, totalRows)} of{' '}
        {totalRows}
        <Select
          value={rowsPerPage}
          onChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
          sx={{
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
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {page === 0 ? null : (
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
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {startPage + index + 1}
          </button>
        ))}

        {page === totalPages - 1 ? null : (
          <>
            <button
              onClick={() => onPageChange(page + 1)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <NavigateNextIcon style={{ color: 'black' }} />
            </button>
            <button
              onClick={() => onPageChange(totalPages - 1)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <LastPageIcon style={{ color: 'black' }} />
            </button>
          </>
        )}
      </div>
    </Box>
  )
}

export default CustomPagination
