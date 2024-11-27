import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import styles from './index.module.scss'; 

const CategoryHeader = ({ categoryName, path }) => {
  return (
    // <Box
    //   sx={{
    //     // bgcolor: '#113163',
    //     // py: 3,
    //     // width: '100%',
    //     // marginBottom: '5px',
    //     overflow: 'hidden',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     position: 'relative',
    //     left: '50%',
    //     right: '50%',
    //     marginLeft: '-50vw', 
    //     marginRight: '-50vw', 
    //     width: '99.3vw', 
    //     backgroundColor: '#113163',
    //     padding: '10px 20px',
    //     height: '6rem',
    //   }}
    // >
    //   {/* <div style={{width:'1050px', margin:'0px auto'}}> */}
    //   <Box
    //     sx={{
    //       marginLeft: '2rem',
    //       // marginTop: '0.6rem',
    //       marginTop: '1rem',
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'space-between',
    //       px: 2,
    //       flexWrap: 'wrap',
    //     }}
    //   >
    //     <Typography
    //       variant="h5"
    //       sx={{
    //         color: 'white',
    //         flexGrow: 1,
    //         fontSize: '1.8rem',
    //         overflow: 'hidden',
    //         textOverflow: 'ellipsis',
    //         display: '-webkit-box',
    //         WebkitBoxOrient: 'vertical',
    //         WebkitLineClamp: 1,
    //         maxWidth: '100%', 
    //       }}
    //     >
    //       {categoryName}
    //     </Typography>

    //     <Box
    //       sx={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         flexWrap: 'wrap',
    //         // justifyContent: 'flex-end', 
    //         justifyContent: 'center',
    //         flexGrow: 1, 
    //         marginTop: { xs: '0.5rem', md: '0' },
    //         minWidth: '0',
    //       }}
    //     >
    //       <Link href="/">
    //         <Typography
    //           variant="body1"
    //           sx={{
    //             color: '#d1d5db',
    //             fontSize: '0.75rem',
    //             textDecoration: 'none',
    //             '&:hover': {
    //               color: 'white',
    //             },
    //           }}
    //         >
    //           Home
    //         </Typography>
    //       </Link>
    //       <Typography
    //         variant="body1"
    //         sx={{
    //           color: '#d1d5db',
    //           mx: 0.2,
    //           fontSize: '0.75rem',
    //           display: 'flex',
    //           alignItems: 'center',
    //         }}
    //       >
    //         <ArrowRightIcon fontSize="small" />
    //       </Typography>
    //       <Link href="/products">
    //         <Typography
    //           variant="body1"
    //           sx={{
    //             color: '#d1d5db',
    //             fontSize: '0.75rem',
    //             textDecoration: 'none',
    //             '&:hover': {
    //               color: 'white',
    //             },
    //           }}
    //         >
    //           Products
    //         </Typography>
    //       </Link>
    //       <Typography
    //         variant="body1"
    //         sx={{
    //           color: '#d1d5db',
    //           mx: 0.2,
    //           fontSize: '0.75rem',
    //           display: 'flex',
    //           alignItems: 'center',
    //         }}
    //       >
    //         <ArrowRightIcon fontSize="small" />
    //       </Typography>
    //       {path.map((category, index) => (
    //         <React.Fragment key={category.slug}>
    //           {index > 0 && (
    //             <Typography
    //               variant="body1"
    //               sx={{
    //                 color: '#d1d5db',
    //                 mx: 0.2,
    //                 fontSize: '0.75rem',
    //                 display: 'flex',
    //                 alignItems: 'center',
    //               }}
    //             >
    //               <ArrowRightIcon fontSize="small" />
    //             </Typography>
    //           )}
    //           {index === path.length - 1 ? (
    //             // <Tooltip title={category.name} arrow>
    //               <Typography
    //                 variant="body1"
    //                 sx={{
    //                   color: 'white',
    //                   fontSize: '0.75rem',
    //                   overflow: 'hidden',
    //                   textOverflow: 'ellipsis',
    //                   display: '-webkit-box',
    //                   WebkitBoxOrient: 'vertical',
    //                   WebkitLineClamp: 1, 
    //                   maxWidth: '100%',
    //                   minWidth: '0', 
    //                 }}
    //               >
    //                 {category.name}
    //               </Typography>
    //             // </Tooltip>
    //           ) : (
    //             <Link href={`/subCategories/${category.slug}`}>
    //               {/* <Tooltip title={category.name} arrow> */}
    //                 <Typography
    //                   variant="body1"
    //                   sx={{
    //                     color: '#d1d5db',
    //                     fontSize: '0.75rem',
    //                     overflow: 'hidden',
    //                     textOverflow: 'ellipsis',
    //                     display: '-webkit-box',
    //                     WebkitBoxOrient: 'vertical',
    //                     WebkitLineClamp: 1,
    //                     maxWidth: '100%',
    //                     minWidth: '0',
    //                     '&:hover': {
    //                       color: 'white',
    //                     },
    //                   }}
    //                 >
    //                   {category.name}
    //                 </Typography>
    //               {/* </Tooltip> */}
    //             </Link>
    //           )}
    //         </React.Fragment>
    //       ))}
    //     </Box>
    //   </Box>
    //   {/* </div> */}
    // </Box>
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
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              flexGrow: 1,
              fontSize: '1.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              maxWidth: '100%',
            }}
          >
            {categoryName}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              flexGrow: 1,
              marginTop: { xs: '0.5rem', md: '0' },
              minWidth: '0',
            }}
          >
            <Link href="/" sx={{ textDecoration: 'none' }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#d1d5db',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Home
              </Typography>
            </Link>
            <Typography
              variant="body1"
              sx={{
                color: '#d1d5db',
                mx: 0.2,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ArrowRightIcon fontSize="small" />
            </Typography>
            <Link href="/products" sx={{ textDecoration: 'none' }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#d1d5db',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                Products
              </Typography>
            </Link>
            <Typography
              variant="body1"
              sx={{
                color: '#d1d5db',
                mx: 0.2,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ArrowRightIcon fontSize="small" />
            </Typography>
            {path.map((category, index) => (
              <React.Fragment key={category.slug}>
                {index > 0 && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#d1d5db',
                      mx: 0.2,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ArrowRightIcon fontSize="small" />
                  </Typography>
                )}
                {index === path.length - 1 ? (
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 1,
                      maxWidth: '100%',
                      minWidth: '0',
                    }}
                  >
                    {category.name}
                  </Typography>
                ) : (
                  <Link href={`/subCategories/${category.slug}`} sx={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#d1d5db',
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        maxWidth: '100%',
                        minWidth: '0',
                        '&:hover': {
                          color: 'white',
                        },
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>

  );
};

export default CategoryHeader;