'use client'
import classes from './index.module.scss'
import * as React from 'react'
import { useState, useEffect } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import Button from '@mui/material/Button'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useMediaQuery } from 'react-responsive'
import { useRef } from 'react'
import Slider from 'react-slick'
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton, Dialog, DialogTitle, DialogContent,
} from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import DeleteIcon from "@mui/icons-material/Delete";
import ReCAPTCHA from 'react-google-recaptcha';

const options = ['India', 'USA', 'Taiwan']
const CompanyType = ['OEM', 'CM', 'Broker', 'Distributor']
const images = [
  'https://www.microchipusa.com/wp-content/uploads/2023/06/altera.png',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/intel.png',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/Xilinx_logo.svg.png',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/Lattice_Semiconductor_logo.svg',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/microsemi-logo-1.png',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/Logo-Cypress-1.png',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/NXP-Logo.svg.png',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/Marvell_Logo.svg',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/amd.png',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/Texas-Instruments-Brands-Logo-PNG-Transparent.png',
  'https://www.microchipusa.com/wp-content/uploads/2023/06/Logo-Cypress-1.png',
];

const RfqForm = () => {
  const [showFileDrop, setShowFileDrop] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorDialog, setErrorDialog] = useState(false);
  const fileInputRef = useRef(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [showCaptchaError, setShowCaptchaError] = useState(false);
  const recaptchaRef = useRef(null);
  const allowedFileTypes = [".pdf", ".xlsx", ".png", ".jpeg", ".jpg"];

  useEffect(() => {

    const pna = async () => {
      try {
        setLoading(true);
        const response1 = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq/countries`);
        setCountries(response1.data)
        const notPresentNames = localStorage.getItem('notPresentNames') || [];
        if (notPresentNames && notPresentNames.length > 0) {
          const parsedNotPresentNames = JSON.parse(notPresentNames);
          if (parsedNotPresentNames.length > 0) {
            setRows(parsedNotPresentNames.map((product) => ({
              partNumber: product.name,
              quantity: '',
              targetPrice: ''
            })));
          }
        }
        localStorage.setItem('notPresentNames', JSON.stringify([]));
        const pn = localStorage.getItem('partNumber') || '';
        if (pn != '') {
          setRows([{ partNumber: pn, quantity: '', targetPrice: '' }]);
        }
        localStorage.setItem('partNumber', '')
      } finally {
        setLoading(false);
      }
    };
    pna();
  }, []);


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    workEmail: '',
    countryId: '',
    companyName: '',
    companyType: '',
    partNumber: '',
    quantity: '',
    targetPrice: '',
    active: 1,
    createdBy: 1,
    modifiedBy: 1,
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    files: []
  });

  const handleFileDelete = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleRadioChange = (event) => {
    setShowFileDrop(event.target.value === 'yes');
  };
  const handleSelectFilesClick = () => {
    if (typeof window !== "undefined" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      const filteredFiles = newFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedFileTypes.includes(`.${fileExtension}`);
      });

      if (filteredFiles.length < newFiles.length) {
        setErrorDialog(true); // Show dialog if any unsupported files were selected
      }

      setSelectedFiles((prevFiles) => {
        const uniqueNewFiles = filteredFiles.filter(
          (newFile) => !prevFiles.some((file) => file.name === newFile.name && file.size === newFile.size)
        );
        return [...prevFiles, ...uniqueNewFiles];
      });
    }
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      processFiles(droppedFiles);
    }
  };

  const processFiles = (files) => {
    const filteredFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      return allowedFileTypes.includes(`.${fileExtension}`);
    });

    if (filteredFiles.length < files.length) {
      setErrorDialog(true); // Show dialog if unsupported files are found
    }

    setSelectedFiles((prevFiles) => {
      const uniqueNewFiles = filteredFiles.filter(
        (newFile) => !prevFiles.some((file) => file.name === newFile.name && file.size === newFile.size)
      );
      return [...prevFiles, ...uniqueNewFiles];
    });
  };
  const handleDialogClose = () => {
    setErrorDialog(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const [errors, setErrors] = useState({});
  const [rows, setRows] = useState([{ partNumber: '', quantity: '', targetPrice: '' }]);

  const validateForm = () => {
    const newErrors = {};
    const alphabetAndSpace = /^[a-zA-Z\s]+$/;
    const phonePattern = /^\d{10}$/;
    const emailPattern = /\S+@\S+\.\S+/;
    const pricePattern = /^\d+(\.\d{1,4})?$/;
    const companyNamePattern = /^[a-zA-Z\s.,]+$/;

    if (!formData.firstName || !alphabetAndSpace.test(formData.firstName)) {
      newErrors.firstName = 'Enter valid First Name';
    }
    if (!formData.lastName || !alphabetAndSpace.test(formData.lastName)) {
      newErrors.lastName = 'Enter valid Second Name';
    }
    if (!formData.phone || !phonePattern.test(formData.phone)) {
      newErrors.phone = 'Enter valid Phone Number';
    }
    if (!formData.workEmail || !emailPattern.test(formData.workEmail)) {
      newErrors.workEmail = 'Enter a valid Email';
    }
    if (!formData.countryId) {
      newErrors.countryId = 'Country is required';
    }
    if (!formData.companyName || !companyNamePattern.test(formData.companyName)) {
      newErrors.companyName = 'Enter valid Company Name';
    }
    // if (!formData.companyType) {
    //   newErrors.companyType = 'Company type is required';
    // }

    rows.forEach((row, index) => {
      if (!row.partNumber) {
        newErrors[`partNumber-${index}`] = 'Not valid';
      }
      if (!row.quantity || isNaN(row.quantity) || row.quantity <= 0 || !Number.isInteger(Number(row.quantity))) {
        newErrors[`quantity-${index}`] = 'Not valid';
      }
      if (!row.targetPrice || !pricePattern.test(row.targetPrice) || parseFloat(row.targetPrice) <= 0) {
        newErrors[`targetPrice-${index}`] = 'Not valid';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
    const { partNumbers, quantities, targetPrices } = generateStrings(newRows);
    setFormData({
      ...formData,
      partNumber: partNumbers,
      quantity: quantities,
      targetPrice: targetPrices,
    });
  };


  const handleAddRow = () => {
    setRows([...rows, { partNumber: '', quantity: '', targetPrice: '' }]);
  };

  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };
  const generateStrings = () => {
    const partNumbers = rows.map(row => row.partNumber).filter(value => value).join('^');
    const quantities = rows.map(row => row.quantity).filter(value => value).join(',');
    const targetPrices = rows.map(row => row.targetPrice).filter(value => value).join(',');

    return {
      partNumbers,
      quantities,
      targetPrices
    };
  };
  // const generateCombinedArray = () => {
  //   return rows
  //     .filter(row => row.partNumber && row.quantity && row.targetPrice) // Ensure only filled rows are sent
  //     .map(row => ({
  //       partNumber: row.partNumber,
  //       quantity: Number(row.quantity), // Convert quantity to number
  //       targetPrice: parseFloat(row.targetPrice)
  //     }));
  // };
  const generateCombinedArray = () => {
    return rows
      .filter(row => row.partNumber) // Ensure partNumber exists
      .map(row => {
        const result = { partNumber: row.partNumber };
  
        if (row.quantity !== '') {
          result.quantity = Number(row.quantity); // Add quantity if not empty
        }
  
        if (row.targetPrice !== '') {
          result.targetPrice = parseFloat(row.targetPrice); // Add targetPrice if not empty
        }
  
        return result;
      });
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaVerified(!!value);
    if (value) {
      setShowCaptchaError(false);
    }
    console.log("handleRecaptchaChange: ",recaptchaVerified);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitLoading(true);
    setShowCaptchaError(false);

    if (!validateForm()) {
      setSubmitLoading(false);
      return;
    }

    if (!recaptchaVerified) {
      setShowCaptchaError(true);
      setSubmitLoading(false);
      return;
    }

    // const { partNumbers, quantities, targetPrices } = generateStrings(rows);
    // const payload = {
    //   ...formData,
    //   partNumber: partNumbers,
    //   quantity: quantities,
    //   targetPrice: targetPrices,
    // };
    const quoteItems = generateCombinedArray();

    const formData1 = new FormData();
    formData1.append('firstName', formData.firstName);
    formData1.append('lastName', formData.lastName);
    formData1.append('phone', formData.phone);
    formData1.append('workEmail', formData.workEmail);
    formData1.append('countryId', formData.countryId);
    formData1.append('companyName', formData.companyName);
    formData1.append('companyType', formData.companyType);
    // formData1.append('partNumber', partNumbers);
    // formData1.append('quantity', quantities);
    // formData1.append('targetPrice', targetPrices);
    formData1.append('active', 1);
    formData1.append('createdBy', 1);
    formData1.append('modifiedBy', 1);
    formData1.append('createdDate', new Date().toISOString());
    formData1.append('modifiedDate', new Date().toISOString());
    formData1.append('quoteItems', JSON.stringify(quoteItems));
    selectedFiles.forEach((file) => {
      formData1.append('files', file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq`,
        {
          method: 'POST',
          body: formData1,
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      setSubmitLoading(false);

      alert('Quote request submitted successfully.');

      setRows([{ partNumber: '', quantity: '', targetPrice: '' }]);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        workEmail: '',
        countryId: '',
        companyName: '',
        companyType: '',
        partNumber: '',
        quantity: '',
        targetPrice: '',
        active: 1,
        createdBy: 1,
        modifiedBy: 1,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        files: [],
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error:', error);
      alert('Please enter valid data,error in submitting data to CRM');
      setSubmitLoading(false);
    }
  };

  const sliderRef = useRef(null)
  const isMediumScreen = useMediaQuery({ query: '(max-width: 600px)' })
  const isSmallScreen = useMediaQuery({ query: '(max-width: 400px)' })
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
    slidesToScroll: isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  if (loading) return <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
  return (
    <>
      <Box className={classes.header}>
        <Box className={classes.carousel}>
          <Slider {...settings} ref={sliderRef}>
            {images.map((image, index) => (
              <Box key={index} className={classes.carouselslide}>
                <Box component="img" src={image} alt={`carousel-${index}`} className={classes.carouselimage} />
              </Box>
            ))}
          </Slider>
        </Box>
        <Box className={classes.banner}>
          <Box component="img" src="https://www.microchipusa.com/wp-content/uploads/2024/02/Certification-Banner-2.png" alt="Banner" />
        </Box>
      </Box>
      <Box className={classes.requestboxhead}>
        <Typography variant="h4" fontWeight="bold" color="#113163">
          Get A Quote Now!
        </Typography>
      </Box>
      <Box className={classes.requestbox}>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          className={classes.requestboxbody}
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography variant="body1" color="black" fontWeight="bold" sx={{ marginBottom: '8px' }}>
            Parts Needed
          </Typography>
          {rows.map((row, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '8px' }}>
                    Part Number
                  </Typography>
                  <TextField
                    value={row.partNumber}
                    onChange={(e) => handleChange(index, 'partNumber', e.target.value)}
                    label={null}
                    size="small"
                    sx={{ backgroundColor: 'white' }}
                    error={!!errors[`partNumber-${index}`]}
                    helperText={errors[`partNumber-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '8px' }}>
                    Quantity
                  </Typography>
                  <TextField
                    value={row.quantity}
                    onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                    label={null}
                    size="small"
                    sx={{ backgroundColor: 'white' }}
                    error={!!errors[`quantity-${index}`]}
                    helperText={errors[`quantity-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sm={3.5} md={3.5}>
                  <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '8px' }}>
                    Target Price
                  </Typography>
                  <TextField
                    value={row.targetPrice}
                    onChange={(e) => handleChange(index, 'targetPrice', e.target.value)}
                    label={null}
                    size="small"
                    sx={{ backgroundColor: 'white' }}
                    error={!!errors[`targetPrice-${index}`]}
                    helperText={errors[`targetPrice-${index}`]}
                  />
                </Grid>
                <Grid item xs={12} sm={1.5} md={1.5}>
                  <AddCircleOutlineIcon className={classes.plusicon} onClick={handleAddRow} sx={{ fontSize: 'large', marginTop: '46px', color: 'grey', cursor: 'pointer' }} />
                  {rows.length > 1 && <RemoveCircleOutlineIcon className={classes.plusicon} onClick={() => handleRemoveRow(index)} sx={{ fontSize: 'large', marginTop: '46px', color: 'grey', cursor: 'pointer' }} />}
                </Grid>
              </Grid>
            </Box>
          ))}
          {/* <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  color="black"
                  fontWeight="bold"
                  sx={{ marginBottom: '8px' }}
                >
                  First Name
                </Typography>
                <TextField
                  label={null}
                  size="small"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  sx={{ backgroundColor: 'white', width: '100%' }}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  color="black"
                  fontWeight="bold"
                  sx={{ marginBottom: '8px' }}
                >
                  Last Name
                </Typography>
                <TextField
                  label={null}
                  size="small"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  sx={{ backgroundColor: 'white', width: '100%' }}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
            </Grid>
          </Box> */}
           {/* <Box sx={{ flexGrow: 2 }}>
            
            <Typography
                  variant="body1"
                  color="black"
                  fontWeight="bold"
                  sx={{ marginBottom: '8px' }}
                >
                  Name  <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
                </Typography>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={6}>
                    <TextField
                      label={null}
                      size="small"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      sx={{ backgroundColor: 'white', width: '100%' }}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label={null}
                      size="small"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      sx={{ backgroundColor: 'white', width: '100%' }}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Grid>
                </Grid>
          </Box> */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body1"
              color="black"
              fontWeight="bold"
              sx={{ marginBottom: '8px' }}
            >
              Name <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={null}
                  size="small"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  sx={{ backgroundColor: 'white', width: '100%' }}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={null}
                  size="small"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  sx={{ backgroundColor: 'white', width: '100%' }}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
            </Grid>

            {/* Phone and Work Email Section */}
            <Grid container spacing={2} sx={{ marginTop: '16px' }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="black" fontWeight="bold">
                  Phone <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
                </Typography>
                <TextField
                  label={null}
                  size="small"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  sx={{ backgroundColor: 'white', mt: 1, width: '100%' }}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="black" fontWeight="bold">
                  Work Email <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
                </Typography>
                <TextField
                  label={null}
                  size="small"
                  value={formData.workEmail}
                  onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  sx={{ backgroundColor: 'white', mt: 1, width: '100%' }}
                  error={!!errors.workEmail}
                  helperText={errors.workEmail}
                />
              </Grid>
            </Grid>
            </Box>
           

          <Typography variant="body1" color="black" fontWeight="bold">
            Country <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
          </Typography>
          <Select
            value={formData.countryId}
            onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
            size="small"
            sx={{ backgroundColor: 'white' }}
            error={!!errors.countryId}
          >
            {countries.map(option => (
              <MenuItem key={option.countryId} value={option.countryId}>
                {option.name}
              </MenuItem>
            ))}
          </Select>

           <Box sx={{ flexGrow: 1 }}>
           <Grid container spacing={2} sx={{ marginTop: '16px' }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="black" fontWeight="bold">
                  Company Name <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
                </Typography>
                <TextField
                  label={null}
                  size="small"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  sx={{ backgroundColor: 'white', mt: 1, width: '100%' }}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" color="black" fontWeight="bold">
                  Company Type
                </Typography>
                <Select
                  value={formData.companyType}
                  onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                  size="small"
                  sx={{ backgroundColor: 'white', mt: 1, width: '100%' }}
                  error={!!errors.companyType}
                >
                  {CompanyType.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              sx={{
                '@media (max-width: 820px)': {
                  width: '100%', 
                },
              }}
            >
              <Typography variant="body1" color="black" fontWeight="bold">
                Do you have a shortage list?
              </Typography>
              <RadioGroup
                aria-labelledby="shortage-list-radio-group-label"
                name="radio-buttons-group"
                onChange={handleRadioChange}
              >
                <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              sx={{
                '@media (max-width: 820px)': {
                  width: '100%', 
                },
              }}
            >
              <Typography variant="body1" color="black" fontWeight="bold">
                CAPTCHA
              </Typography>
              <Box
                sx={{
                  transform: { xs: 'scale(0.85)', sm: 'scale(1)' },
                  transformOrigin: 'center',
                  mt: 1,
                  display: 'inline-block',
                }}
              >
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                  onChange={handleRecaptchaChange}
                  ref={recaptchaRef}
                />
              </Box>
              {showCaptchaError && (
                <Typography variant="body2" color="error" mt={1}>
                  The reCAPTCHA was invalid. Go back and try it again.
                </Typography>
              )}
            </Grid>
          </Grid>
                    
          {showFileDrop && (
            <Box mt={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ textAlign: 'center', marginBottom: '5px' }}>
                We welcome the uploading of full BOMs.
              </Typography>
              <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  border: '1px dashed #ccc',
                  padding: '50px',
                  borderRadius: '5px',
                  textAlign: 'center',
                }}
              >
                Drop files here or <br />
                <span style={{ fontSize: 'small', color: 'gray' }}>
                  Accepted files type- PDF, JPEG, JPG, PNG, XLSX
                </span>

                <br />
                <Button
                  variant="contained"
                  onClick={handleSelectFilesClick}
                  sx={{
                    backgroundColor: '#f5d949',
                    color: 'black',
                    width: '120px',
                    fontSize: '12px',
                    '&:hover': {
                      backgroundColor: '#113163',
                      color: 'white',
                    },
                  }}
                >
                  SELECT FILES
                </Button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </Box>
              {selectedFiles.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Selected Files:</Typography>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>
                        {file.name}
                        <IconButton onClick={() => handleFileDelete(index)} aria-label="delete" size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          )}
          <Button
            variant="contained"
            sx={{
              backgroundColor: submitLoading ? 'grey' : '#f5d949',
              color: 'black',
              height: '28px',
              width: '100%',
              '&:hover': {
                backgroundColor: submitLoading ? 'grey' : '#113163',
                color: 'white',
              },
            }}
            type="submit"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', marginRight: '0.5rem' }} />
                Submitting
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </Box>
        <Dialog open={errorDialog} onClose={handleDialogClose}>
          <DialogTitle>Invalid File Type</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Please upload only files with the following extensions: .pdf, .xlsx, .docx, .png, .jpeg
            </Typography>
          </DialogContent>
          <Button onClick={handleDialogClose} color="primary">OK</Button>
        </Dialog>
      </Box>
    </>
  )
}

export default RfqForm

// 'use client'
// import classes from './index.module.scss'
// import * as React from 'react'
// import { useState, useEffect } from 'react'
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
// import Button from '@mui/material/Button'
// import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'
// import { useMediaQuery } from 'react-responsive'
// import { useRef } from 'react'
// import Slider from 'react-slick'
// import {
//   Grid,
//   Typography,
//   Select,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   IconButton, Dialog, DialogTitle, DialogContent,
// } from '@mui/material'
// import Box from '@mui/material/Box'
// import TextField from '@mui/material/TextField'
// import CircularProgress from '@mui/material/CircularProgress'
// import axios from 'axios'
// import DeleteIcon from "@mui/icons-material/Delete";

// const options = ['India', 'USA', 'Taiwan']
// const CompanyType = ['OEM', 'CM', 'Broker', 'Distributor']
// const images = [
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/altera.png',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/intel.png',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/Xilinx_logo.svg.png',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/Lattice_Semiconductor_logo.svg',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/microsemi-logo-1.png',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/Logo-Cypress-1.png',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/NXP-Logo.svg.png',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/Marvell_Logo.svg',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/amd.png',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/Texas-Instruments-Brands-Logo-PNG-Transparent.png',
//   'https://www.microchipusa.com/wp-content/uploads/2023/06/Logo-Cypress-1.png',
// ];

// const RfqForm = () => {
//   const [showFileDrop, setShowFileDrop] = useState(false);
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true)
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [errorDialog, setErrorDialog] = useState(false);
//   const fileInputRef = useRef(null);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const allowedFileTypes = [".pdf", ".xlsx", ".png", ".jpeg", ".jpg"];

//   useEffect(() => {

//     const pna = async () => {
//       try {
//         setLoading(true);
//         const response1 = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq/countries`);
//         setCountries(response1.data)
//         const notPresentNames = localStorage.getItem('notPresentNames') || [];
//         if (notPresentNames && notPresentNames.length > 0) {
//           const parsedNotPresentNames = JSON.parse(notPresentNames);
//           if (parsedNotPresentNames.length > 0) {
//             setRows(parsedNotPresentNames.map((product) => ({
//               partNumber: product.name,
//               quantity: '',
//               targetPrice: ''
//             })));
//           }
//         }
//         localStorage.setItem('notPresentNames', JSON.stringify([]));
//         const pn = localStorage.getItem('partNumber') || '';
//         if (pn != '') {
//           setRows([{ partNumber: pn, quantity: '', targetPrice: '' }]);
//         }
//         localStorage.setItem('partNumber', '')
//       } finally {
//         setLoading(false);
//       }
//     };
//     pna();
//   }, []);


//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     workEmail: '',
//     countryId: '',
//     companyName: '',
//     companyType: '',
//     partNumber: '',
//     quantity: '',
//     targetPrice: '',
//     active: 1,
//     createdBy: 1,
//     modifiedBy: 1,
//     createdDate: new Date().toISOString(),
//     modifiedDate: new Date().toISOString(),
//     files: []
//   });

//   const handleFileDelete = (index) => {
//     setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//   };

//   const handleRadioChange = (event) => {
//     setShowFileDrop(event.target.value === 'yes');
//   };
//   const handleSelectFilesClick = () => {
//     if (typeof window !== "undefined" && fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (event) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const newFiles = Array.from(event.target.files);
//       const filteredFiles = newFiles.filter((file) => {
//         const fileExtension = file.name.split(".").pop().toLowerCase();
//         return allowedFileTypes.includes(`.${fileExtension}`);
//       });

//       if (filteredFiles.length < newFiles.length) {
//         setErrorDialog(true); // Show dialog if any unsupported files were selected
//       }

//       setSelectedFiles((prevFiles) => {
//         const uniqueNewFiles = filteredFiles.filter(
//           (newFile) => !prevFiles.some((file) => file.name === newFile.name && file.size === newFile.size)
//         );
//         return [...prevFiles, ...uniqueNewFiles];
//       });
//     }
//     event.target.value = '';
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     if (event.dataTransfer.files) {
//       const droppedFiles = Array.from(event.dataTransfer.files);
//       processFiles(droppedFiles);
//     }
//   };

//   const processFiles = (files) => {
//     const filteredFiles = files.filter((file) => {
//       const fileExtension = file.name.split(".").pop().toLowerCase();
//       return allowedFileTypes.includes(`.${fileExtension}`);
//     });

//     if (filteredFiles.length < files.length) {
//       setErrorDialog(true); // Show dialog if unsupported files are found
//     }

//     setSelectedFiles((prevFiles) => {
//       const uniqueNewFiles = filteredFiles.filter(
//         (newFile) => !prevFiles.some((file) => file.name === newFile.name && file.size === newFile.size)
//       );
//       return [...prevFiles, ...uniqueNewFiles];
//     });
//   };
//   const handleDialogClose = () => {
//     setErrorDialog(false);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };
//   const [errors, setErrors] = useState({});
//   const [rows, setRows] = useState([{ partNumber: '', quantity: '', targetPrice: '' }]);

//   const validateForm = () => {
//     const newErrors = {};
//     const alphabetAndSpace = /^[a-zA-Z\s]+$/;
//     const phonePattern = /^\d{10}$/;
//     const emailPattern = /\S+@\S+\.\S+/;
//     const pricePattern = /^\d+(\.\d{1,4})?$/;
//     const companyNamePattern = /^[a-zA-Z\s.,]+$/;

//     if (!formData.firstName || !alphabetAndSpace.test(formData.firstName)) {
//       newErrors.firstName = 'Enter valid First Name';
//     }
//     if (!formData.lastName || !alphabetAndSpace.test(formData.lastName)) {
//       newErrors.lastName = 'Enter valid Second Name';
//     }
//     if (!formData.phone || !phonePattern.test(formData.phone)) {
//       newErrors.phone = 'Enter valid Phone Number';
//     }
//     if (!formData.workEmail || !emailPattern.test(formData.workEmail)) {
//       newErrors.workEmail = 'Enter a valid Email';
//     }
//     if (!formData.countryId) {
//       newErrors.countryId = 'Country is required';
//     }
//     if (!formData.companyName || !companyNamePattern.test(formData.companyName)) {
//       newErrors.companyName = 'Enter valid Company Name';
//     }
//     if (!formData.companyType) {
//       newErrors.companyType = 'Company type is required';
//     }

//     rows.forEach((row, index) => {
//       if (!row.partNumber) {
//         newErrors[`partNumber-${index}`] = 'Not valid';
//       }
//       if (!row.quantity || isNaN(row.quantity) || row.quantity <= 0 || !Number.isInteger(Number(row.quantity))) {
//         newErrors[`quantity-${index}`] = 'Not valid';
//       }
//       if (!row.targetPrice || !pricePattern.test(row.targetPrice) || parseFloat(row.targetPrice) <= 0) {
//         newErrors[`targetPrice-${index}`] = 'Not valid';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (index, field, value) => {
//     const newRows = [...rows];
//     newRows[index] = { ...newRows[index], [field]: value };
//     setRows(newRows);
//     const { partNumbers, quantities, targetPrices } = generateStrings(newRows);
//     setFormData({
//       ...formData,
//       partNumber: partNumbers,
//       quantity: quantities,
//       targetPrice: targetPrices,
//     });
//   };


//   const handleAddRow = () => {
//     setRows([...rows, { partNumber: '', quantity: '', targetPrice: '' }]);
//   };

//   const handleRemoveRow = (index) => {
//     if (rows.length > 1) {
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };
//   const generateStrings = () => {
//     const partNumbers = rows.map(row => row.partNumber).filter(value => value).join('^');
//     const quantities = rows.map(row => row.quantity).filter(value => value).join(',');
//     const targetPrices = rows.map(row => row.targetPrice).filter(value => value).join(',');

//     return {
//       partNumbers,
//       quantities,
//       targetPrices
//     };
//   };
//   const generateCombinedArray = () => {
//     return rows
//       .filter(row => row.partNumber && row.quantity && row.targetPrice) // Ensure only filled rows are sent
//       .map(row => ({
//         partNumber: row.partNumber,
//         quantity: Number(row.quantity), // Convert quantity to number
//         targetPrice: parseFloat(row.targetPrice)
//       }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setSubmitLoading(true);

//     if (!validateForm()) {
//       setSubmitLoading(false);
//       return;
//     }

//     // const { partNumbers, quantities, targetPrices } = generateStrings(rows);
//     // const payload = {
//     //   ...formData,
//     //   partNumber: partNumbers,
//     //   quantity: quantities,
//     //   targetPrice: targetPrices,
//     // };
//     const quoteItems = generateCombinedArray();

//     const formData1 = new FormData();
//     formData1.append('firstName', formData.firstName);
//     formData1.append('lastName', formData.lastName);
//     formData1.append('phone', formData.phone);
//     formData1.append('workEmail', formData.workEmail);
//     formData1.append('countryId', formData.countryId);
//     formData1.append('companyName', formData.companyName);
//     formData1.append('companyType', formData.companyType);
//     // formData1.append('partNumber', partNumbers);
//     // formData1.append('quantity', quantities);
//     // formData1.append('targetPrice', targetPrices);
//     formData1.append('active', 1);
//     formData1.append('createdBy', 1);
//     formData1.append('modifiedBy', 1);
//     formData1.append('createdDate', new Date().toISOString());
//     formData1.append('modifiedDate', new Date().toISOString());
//     formData1.append('quoteItems', JSON.stringify(quoteItems));
//     selectedFiles.forEach((file) => {
//       formData1.append('files', file);
//     });

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq`,
//         {
//           method: 'POST',
//           body: formData1,
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }
//       setSubmitLoading(false);

//       alert('Quote request submitted successfully.');

//       setRows([{ partNumber: '', quantity: '', targetPrice: '' }]);
//       setFormData({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         workEmail: '',
//         countryId: '',
//         companyName: '',
//         companyType: '',
//         partNumber: '',
//         quantity: '',
//         targetPrice: '',
//         active: 1,
//         createdBy: 1,
//         modifiedBy: 1,
//         createdDate: new Date().toISOString(),
//         modifiedDate: new Date().toISOString(),
//         files: [],
//       });
//       setSelectedFiles([]);
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Please enter valid data,error in submitting data to CRM');
//       setSubmitLoading(false);
//     }
//   };

//   // const handleSubmit = async (event) => {
//   //   event.preventDefault();
//   //   if (!validateForm()) {
//   //     return;
//   //   }
//   //   const { partNumbers, quantities, targetPrices } = generateStrings(rows);
//   //   const payload = {
//   //     ...formData,
//   //     partNumber: partNumbers,
//   //     quantity: quantities,
//   //     targetPrice: targetPrices,
//   //   };
//   //   const formData1 = new FormData();
//   // formData1.append('firstName', formData.firstName);
//   // formData1.append('lastName', formData.lastName);
//   // formData1.append('phone', formData.phone);
//   // formData1.append('workEmail', formData.workEmail);
//   // formData1.append('countryId', formData.countryId);
//   // formData1.append('companyName', formData.companyName);
//   // formData1.append('companyType', formData.companyType);
//   // formData1.append('partNumber', partNumbers);
//   // formData1.append('quantity', quantities);
//   // formData1.append('targetPrice', targetPrices);
//   // formData1.append('active', 1);
//   // formData1.append('createdBy', 1);
//   // formData1.append('modifiedBy', 1);
//   // formData1.append('createdDate', new Date().toISOString());
//   // formData1.append('modifiedDate', new Date().toISOString());
//   // selectedFiles.forEach(file => {
//   //   formData1.append('files', file); 
//   // });
//   //   try {
//   //     const response = await fetch(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq`, {
//   //       method: 'POST',
//   //       body: formData1,
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error('Network response was not ok.');
//   //     }
//   //     alert('Quote request submitted successfully.');
//   //     setRows([{ partNumber: '', quantity: '', targetPrice: '' }]);
//   //     setFormData({
//   //       firstName: '',
//   //       lastName: '',
//   //       phone: '',
//   //       workEmail: '',
//   //       countryId: '',
//   //       companyName: '',
//   //       companyType: '',
//   //       partNumber: '',
//   //       quantity: '',
//   //       targetPrice: '',
//   //       active: 1,
//   //       createdBy: 1,
//   //       modifiedBy: 1,
//   //       createdDate: new Date().toISOString(),
//   //       modifiedDate: new Date().toISOString(),
//   //       files:[]
//   //     });
//   //     setSelectedFiles([]);
//   //   } catch (error) {
//   //     console.error('Error:', error);
//   //     alert('There was an error submitting your request.');
//   //   }
//   // };

//   const sliderRef = useRef(null)
//   const isMediumScreen = useMediaQuery({ query: '(max-width: 600px)' })
//   const isSmallScreen = useMediaQuery({ query: '(max-width: 400px)' })
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 1000,
//     slidesToShow: isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
//     slidesToScroll: isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
//     arrows: false,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };
//   if (loading) return <Box
//     sx={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//     }}
//   >
//     <CircularProgress />
//   </Box>
//   return (
//     <>
//       <Box className={classes.header}>
//         <Box className={classes.carousel}>
//           <Slider {...settings} ref={sliderRef}>
//             {images.map((image, index) => (
//               <Box key={index} className={classes.carouselslide}>
//                 <Box component="img" src={image} alt={`carousel-${index}`} className={classes.carouselimage} />
//               </Box>
//             ))}
//           </Slider>
//         </Box>
//         <Box className={classes.banner}>
//           <Box component="img" src="https://www.microchipusa.com/wp-content/uploads/2024/02/Certification-Banner-2.png" alt="Banner" />
//         </Box>
//       </Box>
//       <Box className={classes.requestboxhead}>
//         <Typography variant="h4" fontWeight="bold" color="#113163">
//           Get A Quote Now!
//         </Typography>
//       </Box>
//       <Box className={classes.requestbox}>
//         <Box
//           sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
//           className={classes.requestboxbody}
//           component="form"
//           onSubmit={handleSubmit}
//         >
//           <Typography variant="body1" color="black" fontWeight="bold" sx={{ marginBottom: '8px' }}>
//             Parts Needed
//           </Typography>
//           {rows.map((row, index) => (
//             <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
//               <Grid container spacing={1}>
//                 <Grid item xs={12} sm={3.5} md={3.5}>
//                   <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '8px' }}>
//                     Part Number
//                   </Typography>
//                   <TextField
//                     value={row.partNumber}
//                     onChange={(e) => handleChange(index, 'partNumber', e.target.value)}
//                     label={null}
//                     size="small"
//                     sx={{ backgroundColor: 'white' }}
//                     error={!!errors[`partNumber-${index}`]}
//                     helperText={errors[`partNumber-${index}`]}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={3.5} md={3.5}>
//                   <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '8px' }}>
//                     Quantity
//                   </Typography>
//                   <TextField
//                     value={row.quantity}
//                     onChange={(e) => handleChange(index, 'quantity', e.target.value)}
//                     label={null}
//                     size="small"
//                     sx={{ backgroundColor: 'white' }}
//                     error={!!errors[`quantity-${index}`]}
//                     helperText={errors[`quantity-${index}`]}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={3.5} md={3.5}>
//                   <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '8px' }}>
//                     Target Price
//                   </Typography>
//                   <TextField
//                     value={row.targetPrice}
//                     onChange={(e) => handleChange(index, 'targetPrice', e.target.value)}
//                     label={null}
//                     size="small"
//                     sx={{ backgroundColor: 'white' }}
//                     error={!!errors[`targetPrice-${index}`]}
//                     helperText={errors[`targetPrice-${index}`]}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={1.5} md={1.5}>
//                   <AddCircleOutlineIcon className={classes.plusicon} onClick={handleAddRow} sx={{ fontSize: 'large', marginTop: '46px', color: 'grey', cursor: 'pointer' }} />
//                   {rows.length > 1 && <RemoveCircleOutlineIcon className={classes.plusicon} onClick={() => handleRemoveRow(index)} sx={{ fontSize: 'large', marginTop: '46px', color: 'grey', cursor: 'pointer' }} />}
//                 </Grid>
//               </Grid>
//             </Box>
//           ))}
//           <Box sx={{ flexGrow: 1 }}>
//             <Grid container spacing={1}>
//               <Grid item xs={6}>
//                 <Typography
//                   variant="body1"
//                   color="black"
//                   fontWeight="bold"
//                   sx={{ marginBottom: '8px' }}
//                 >
//                   First Name
//                 </Typography>
//                 <TextField
//                   label={null}
//                   size="small"
//                   value={formData.firstName}
//                   onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                   sx={{ backgroundColor: 'white', width: '100%' }}
//                   error={!!errors.firstName}
//                   helperText={errors.firstName}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography
//                   variant="body1"
//                   color="black"
//                   fontWeight="bold"
//                   sx={{ marginBottom: '8px' }}
//                 >
//                   Last Name
//                 </Typography>
//                 <TextField
//                   label={null}
//                   size="small"
//                   value={formData.lastName}
//                   onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                   sx={{ backgroundColor: 'white', width: '100%' }}
//                   error={!!errors.lastName}
//                   helperText={errors.lastName}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//           <Typography variant="body1" color="black" fontWeight="bold">
//             Phone
//           </Typography>
//           <TextField
//             label={null}
//             size="small"
//             value={formData.phone}
//             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//             sx={{ backgroundColor: 'white' }}
//             error={!!errors.phone}
//             helperText={errors.phone}
//           />
//           <Typography variant="body1" color="black" fontWeight="bold">
//             Work Email
//           </Typography>
//           <TextField
//             label={null}
//             size="small"
//             value={formData.workEmail}
//             onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
//             sx={{ backgroundColor: 'white' }}
//             error={!!errors.workEmail}
//             helperText={errors.workEmail}
//           />
//           <Typography variant="body1" color="black" fontWeight="bold">
//             Country
//           </Typography>
//           <Select
//             value={formData.countryId}
//             onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
//             size="small"
//             sx={{ backgroundColor: 'white' }}
//             error={!!errors.countryId}
//           >
//             {countries.map(option => (
//               <MenuItem key={option.countryId} value={option.countryId}>
//                 {option.name}
//               </MenuItem>
//             ))}
//           </Select>
//           <Typography variant="body1" color="black" fontWeight="bold">
//             Company Name
//           </Typography>
//           <TextField
//             label={null}
//             size="small"
//             value={formData.companyName}
//             onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//             sx={{ backgroundColor: 'white' }}
//             error={!!errors.companyName}
//             helperText={errors.companyName}
//           />
//           <Typography variant="body1" color="black" fontWeight="bold">
//             Company Type
//           </Typography>
//           <Select
//             value={formData.companyType}
//             onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
//             size="small"
//             sx={{ backgroundColor: 'white' }}
//             error={!!errors.companyType}
//           >
//             {CompanyType.map(option => (
//               <MenuItem key={option} value={option}>
//                 {option}
//               </MenuItem>
//             ))}
//           </Select>
//           <Typography variant="body1" color="black" fontWeight="bold">
//             Do you have a shortage list?
//           </Typography>
//           <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" onChange={handleRadioChange}>
//             <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
//             <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
//           </RadioGroup>
//           {showFileDrop && (
//             <Box mt={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
//               <Typography sx={{ textAlign: 'center', marginBottom: '5px' }}>
//                 We welcome the uploading of full BOMs.
//               </Typography>
//               <Box
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 style={{
//                   border: '1px dashed #ccc',
//                   padding: '50px',
//                   borderRadius: '5px',
//                   textAlign: 'center',
//                 }}
//               >
//                 Drop files here or <br />
//                 <span style={{ fontSize: 'small', color: 'gray' }}>
//                   Accepted files type- PDF, JPEG, JPG, PNG, XLSX
//                 </span>

//                 <br />
//                 <Button
//                   variant="contained"
//                   onClick={handleSelectFilesClick}
//                   sx={{
//                     backgroundColor: '#f5d949',
//                     color: 'black',
//                     width: '120px',
//                     fontSize: '12px',
//                     '&:hover': {
//                       backgroundColor: '#113163',
//                       color: 'white',
//                     },
//                   }}
//                 >
//                   SELECT FILES
//                 </Button>
//                 <input
//                   type="file"
//                   multiple
//                   ref={fileInputRef}
//                   style={{ display: 'none' }}
//                   onChange={handleFileChange}
//                 />
//               </Box>
//               {selectedFiles.length > 0 && (
//                 <Box mt={2}>
//                   <Typography variant="subtitle1">Selected Files:</Typography>
//                   <ul>
//                     {selectedFiles.map((file, index) => (
//                       <li key={index}>
//                         {file.name}
//                         <IconButton onClick={() => handleFileDelete(index)} aria-label="delete" size="small">
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </li>
//                     ))}
//                   </ul>
//                 </Box>
//               )}
//             </Box>
//           )}
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: submitLoading ? 'grey' : '#f5d949',
//               color: 'black',
//               height: '28px',
//               width: '100%',
//               '&:hover': {
//                 backgroundColor: submitLoading ? 'grey' : '#113163',
//                 color: 'white',
//               },
//             }}
//             type="submit"
//             disabled={submitLoading}
//           >
//             {submitLoading ? (
//               <>
//                 <CircularProgress size={20} sx={{ color: 'white', marginRight: '0.5rem' }} />
//                 Submitting
//               </>
//             ) : (
//               'Submit'
//             )}
//           </Button>
//         </Box>
//         <Dialog open={errorDialog} onClose={handleDialogClose}>
//           <DialogTitle>Invalid File Type</DialogTitle>
//           <DialogContent>
//             <Typography variant="body1">
//               Please upload only files with the following extensions: .pdf, .xlsx, .docx, .png, .jpeg
//             </Typography>
//           </DialogContent>
//           <Button onClick={handleDialogClose} color="primary">OK</Button>
//         </Dialog>
//       </Box>
//     </>
//   )
// }

// export default RfqForm