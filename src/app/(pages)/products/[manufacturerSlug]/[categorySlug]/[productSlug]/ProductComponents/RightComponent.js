'use client'
import classes from './index.module.scss'
import * as React from 'react'
import { useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import Button from '@mui/material/Button'
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
  IconButton, Dialog, DialogTitle, DialogContent, Checkbox
} from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useRef } from 'react'
import DeleteIcon from "@mui/icons-material/Delete";
import ReCAPTCHA from 'react-google-recaptcha';

const options = ['India', 'USA', 'Taiwan']
const CompanyType = ['OEM', 'CM', 'Broker', 'Distributor']

const RightComponent = ({data,countries}) => {
  const [showFileDrop, setShowFileDrop] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorDialog, setErrorDialog] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [showCaptchaError, setShowCaptchaError] = useState(false);
  const recaptchaRef = useRef(null);
  const allowedFileTypes = [".pdf", ".xlsx", ".png", ".jpeg", ".jpg"];
  const fileInputRef = useRef(null);
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
    files:[]
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
  const [rows, setRows] = useState([{ partNumber: data.name, quantity: '', targetPrice: '' }]);

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

    // rows.forEach((row, index) => {
    //   if (!row.partNumber) {
    //     newErrors[`partNumber-${index}`] = 'Not valid';
    //   }
    //   if (!row.quantity || isNaN(row.quantity) || row.quantity <= 0|| !Number.isInteger(Number(row.quantity))) {
    //     newErrors[`quantity-${index}`] = 'Not valid';
    //   }
    //   if (!row.targetPrice || !pricePattern.test(row.targetPrice) || parseFloat(row.targetPrice) <= 0) {
    //     newErrors[`targetPrice-${index}`] = 'Not valid';
    //   }
    // });

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
  const generateCombinedArray = () => {
    return rows
      .filter(row => row.partNumber && row.quantity && row.targetPrice) // Ensure only filled rows are sent
      .map(row => ({
        partNumber: row.partNumber,
        quantity: Number(row.quantity), // Convert quantity to number
        targetPrice: parseFloat(row.targetPrice)
      }));
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

    if (!validateForm()) {
      return;
    }

    if (!recaptchaVerified) {
      setShowCaptchaError(true);
      return;
    }
    const { partNumbers, quantities, targetPrices } = generateStrings(rows);
    const payload = {
      ...formData,
      partNumber: partNumbers,
      quantity: quantities,
      targetPrice: targetPrices,
    };
    const quoteItems = generateCombinedArray();
    const formData1 = new FormData();
  formData1.append('firstName', formData.firstName);
  formData1.append('lastName', formData.lastName);
  formData1.append('phone', formData.phone);
  formData1.append('workEmail', formData.workEmail);
  formData1.append('countryId', formData.countryId);
  formData1.append('companyName', formData.companyName);
  formData1.append('companyType', formData.companyType);
  formData1.append('partNumber', partNumbers);
  formData1.append('quantity', quantities);
  formData1.append('targetPrice', targetPrices);
  formData1.append('active', 1);
  formData1.append('createdBy', 1);
  formData1.append('modifiedBy', 1);
  formData1.append('createdDate', new Date().toISOString());
  formData1.append('modifiedDate', new Date().toISOString());
  formData1.append('quoteItems', JSON.stringify(quoteItems));
  selectedFiles.forEach(file => {
    formData1.append('files', file); 
  });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq`, {
        method: 'POST',
        body: formData1,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
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
        files:[]
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error:', error);
      alert('Please enter valid data,error in submitting data to CRM');
    }
  };
  return (
    <>
      <Box className={classes.requestbox}>
        <Box className={classes.requestboxhead}>
          <Typography variant="h4" fontWeight="bold" color="text.secondary">
            Request a Quote
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          className={classes.requestboxbody}
          component="form"
          onSubmit={handleSubmit}
        >
          <Box sx={{ flexGrow: 1 }}>
            
            <Typography
                  variant="body1"
                  color="black"
                  fontWeight="bold"
                  sx={{ marginBottom: '8px' }}
                >
                  Name  <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
                </Typography>
                <Grid container >
                  <Grid  sx={{display:'flex'}}>
                    <TextField
                      label={null}
                      size="small"
                      placeholder='First Name'
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      sx={{ backgroundColor: 'white', width: '100%', marginRight:'5px' }}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                    <TextField
                      label={null}
                      size="small"
                      placeholder='Last Name'
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      sx={{ backgroundColor: 'white', width: '100%' }}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Grid>
            </Grid>
          </Box>
          <Typography variant="body1" color="black" fontWeight="bold">
            Phone <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
          </Typography>
          <TextField
            label={null}
            size="small"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            sx={{ backgroundColor: 'white' }}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <Typography variant="body1" color="black" fontWeight="bold">
            Work Email <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
          </Typography>
          <TextField
            label={null}
            size="small"
            value={formData.workEmail}
            onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
            sx={{ backgroundColor: 'white' }}
            error={!!errors.workEmail}
            helperText={errors.workEmail}
          />
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
          <Typography variant="body1" color="black" fontWeight="bold">
            Company Name <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>(required)</span>
          </Typography>
          <TextField
            label={null}
            size="small"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            sx={{ backgroundColor: 'white' }}
            error={!!errors.companyName}
            helperText={errors.companyName}
          />
          {/* <Box>
            <Typography variant="body1" color="black" fontWeight="bold">
                CAPTCHA
            </Typography>
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_SITE_KEY} />
          </Box> */}
            {/* <Box display="flex" flexDirection="column" mt={2}>
              <Typography variant="body1" color="black" fontWeight="bold">
                CAPTCHA
              </Typography>
              <ReCAPTCHA 
                sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                onChange={handleRecaptchaChange}
                ref={recaptchaRef}
              />
              {showCaptchaError && (
                <Typography variant="body2" color="error" mt={1}>
                  The reCAPTCHA was invalid. Go back and try it again.
                </Typography>
              )}
            </Box> */}
            <Box 
              display="flex" 
              flexDirection="column" 
              mt={2} 
              sx={{ alignItems: { xs: 'center', sm: 'flex-start' }, width: '100%' }}
            >
              <Typography 
                variant="body1" 
                color="black" 
                fontWeight="bold" 
                sx={{ textAlign: { xs: 'center', sm: 'left' }, marginBottom: '8px' }}
              >
                CAPTCHA
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', sm: 'flex-start' }, 
                  width: '100%' 
                }}
              >
                <ReCAPTCHA 
                  sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
                  onChange={handleRecaptchaChange}
                  ref={recaptchaRef}
                  sx={{ transform: { xs: 'scale(0.85)', sm: 'scale(1)' }, transformOrigin: 'center' }}
                />
              </Box>
              {showCaptchaError && (
                <Typography 
                  variant="body2" 
                  color="error" 
                  mt={1} 
                  sx={{ textAlign: { xs: 'center', sm: 'left' } }}
                >
                  The reCAPTCHA was invalid. Go back and try it again.
                </Typography>
              )}
            </Box>
         
          <FormControlLabel
            control={
              <Checkbox
                checked={showAdditionalFields}
                onChange={(e) => setShowAdditionalFields(e.target.checked)}
                color="primary"
              />
            }
            label="Additional Details (Optional)"
          />

          {showAdditionalFields && (
            <>
            <div style={{borderTop:'1px solid #656871', marginBottom:'5px', marginTop:'25px'}}></div>
              <Typography variant="body1" color="black" fontWeight="bold">
                Company Type
              </Typography>
              <Select
                value={formData.companyType}
                onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
                size="small"
                sx={{ backgroundColor: 'white' }}
                error={!!errors.companyType}
              >
                {CompanyType.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>

              {/* <Typography variant="body1" color="black" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                Parts Needed
              </Typography> */}
              {rows.map((row, index) => (
                <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2, 
                  textAlign: 'left' 
                }}
              >
                <Grid container spacing={2}>
                  {/* Part Number Field */}
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography variant="body1" color="black" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                      Part Number
                    </Typography>
                    <TextField
                      value={row.partNumber}
                      onChange={(e) => handleChange(index, 'partNumber', e.target.value)}
                      label={null}
                      size="small"
                      sx={{ backgroundColor: 'white', width: '100%' }}
                      error={!!errors[`partNumber-${index}`]}
                      helperText={errors[`partNumber-${index}`]}
                    />
                  </Grid>
              
                  <Grid item xs={12} sm={6} md={6}>
                    <Typography variant="body1" color="black" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                      Target Price
                    </Typography>
                    <TextField
                      value={row.targetPrice}
                      onChange={(e) => handleChange(index, 'targetPrice', e.target.value)}
                      label={null}
                      size="small"
                      sx={{ backgroundColor: 'white', width: '100%' }}
                      error={!!errors[`targetPrice-${index}`]}
                      helperText={errors[`targetPrice-${index}`]}
                    />
                  </Grid>
              
                  <Grid item xs={12}>
                    <Typography variant="body1" color="black" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                      Quantity
                    </Typography>
                    <TextField
                      value={row.quantity}
                      onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                      label={null}
                      size="small"
                      sx={{ backgroundColor: 'white', width: '100%' }}
                      error={!!errors[`quantity-${index}`]}
                      helperText={errors[`quantity-${index}`]}
                    />
                  </Grid>
                </Grid>
              </Box>
              ))}
            
          <Typography variant="body1" color="black" fontWeight="bold">
            Do you have a shortage list?
          </Typography>
          <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group" onChange={handleRadioChange}>
            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
          </RadioGroup>
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
      </>
      )}
       <div style={{borderTop:'1px solid #656871', marginBottom:'5px', marginTop:'25px'}}></div>
       <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2, 
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f5d949',
              color: 'black',
              height: '28px',
              width: '80%',
              '&:hover': {
                backgroundColor: '#113163',
                color: 'white',
              }
            }}
            type="submit"
          >
            REQUEST A QUOTE
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f5d949',
              color: 'black',
              height: '28px',
              width: '80%',
              '&:hover': {
                          backgroundColor: '#113163',
                          color: 'white',
                        }
            }}
            type="submit"
          >
            BOOK A MEETING
          </Button>
          </Box>
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

export default RightComponent

// 'use client'
// import classes from './index.module.scss'
// import * as React from 'react'
// import { useState } from 'react'
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
// import Button from '@mui/material/Button'
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
// } from '@mui/material'
// import Box from '@mui/material/Box'
// import TextField from '@mui/material/TextField'
// import { useRef } from 'react'

// const options = ['India', 'USA', 'Taiwan']
// const CompanyType = ['OEM', 'CM', 'Broker', 'Distributor']

// const RightComponent = ({data,countries}) => {
//   const [showFileDrop, setShowFileDrop] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const fileInputRef = useRef(null);
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
//     files:[]
//   });

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
      
//       setSelectedFiles((prevFiles) => {
//         // Filter out duplicates by checking if each new file is already in selectedFiles
//         const uniqueNewFiles = newFiles.filter(
//           (newFile) => !prevFiles.some((file) => file.name === newFile.name && file.size === newFile.size)
//         );
//         return [...prevFiles, ...uniqueNewFiles];
//       });
//     }
//     event.target.value='';
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     if (event.dataTransfer.files) {
//       setSelectedFiles([...selectedFiles,...event.dataTransfer.files]); 
//     }
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };
//   const [errors, setErrors] = useState({});
//   const [rows, setRows] = useState([{ partNumber: data.name, quantity: '', targetPrice: '' }]);

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
//       if (!row.quantity || isNaN(row.quantity) || row.quantity <= 0|| !Number.isInteger(Number(row.quantity))) {
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
//     if (!validateForm()) {
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
//   formData1.append('firstName', formData.firstName);
//   formData1.append('lastName', formData.lastName);
//   formData1.append('phone', formData.phone);
//   formData1.append('workEmail', formData.workEmail);
//   formData1.append('countryId', formData.countryId);
//   formData1.append('companyName', formData.companyName);
//   formData1.append('companyType', formData.companyType);
//   // formData1.append('partNumber', partNumbers);
//   // formData1.append('quantity', quantities);
//   // formData1.append('targetPrice', targetPrices);
//   formData1.append('active', 1);
//   formData1.append('createdBy', 1);
//   formData1.append('modifiedBy', 1);
//   formData1.append('createdDate', new Date().toISOString());
//   formData1.append('modifiedDate', new Date().toISOString());
//   formData1.append('quoteItems', JSON.stringify(quoteItems));
//   selectedFiles.forEach(file => {
//     formData1.append('files', file); 
//   });
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq`, {
//         method: 'POST',
//         body: formData1,
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok.');
//       }
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
//         files:[]
//       });
//       setSelectedFiles([]);
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Please enter valid data,error in submitting data to CRM');
//     }
//   };
//   return (
//     <>
//       <Box className={classes.requestbox}>
//         <Box className={classes.requestboxhead}>
//           <Typography variant="h4" fontWeight="bold" color="text.secondary">
//             Request a Quote
//           </Typography>
//         </Box>
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
//                   <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
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
//                   <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
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
//                   <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
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
//                   <AddCircleOutlineIcon onClick={handleAddRow} className={classes.plusicon} sx={{fontSize:'large',marginTop:'46px',color:'grey',cursor:'pointer'}} />
//                   {rows.length > 1 && <RemoveCircleOutlineIcon className={classes.plusicon} onClick={() => handleRemoveRow(index)} sx={{fontSize:'large',marginTop:'46px',color:'grey',cursor:'pointer'}} />}
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
//         <Box mt={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
//           <Typography sx={{ textAlign: 'center', marginBottom: '5px' }}>
//             We welcome the uploading of full BOMs.
//           </Typography>
//           <Box
//             onDrop={handleDrop} 
//             onDragOver={handleDragOver} 
//             style={{
//               border: '1px dashed #ccc',
//               padding: '50px',
//               borderRadius: '5px',
//               textAlign: 'center',
//             }}
//           >
//             Drop files here or
//             <br />
//             <Button
//               variant="contained"
//               onClick={handleSelectFilesClick}
//               sx={{
//                 backgroundColor: '#f5d949',
//                 color: 'black',
//                 width: '120px',
//                 fontSize: '12px',
//                 '&:hover': {
//                   backgroundColor: '#113163',
//                   color: 'white',
//                 },
//               }}
//             >
//               SELECT FILES
//             </Button>
//             <input
//               type="file"
//               multiple
//               ref={fileInputRef}
//               style={{ display: 'none' }}
//               onChange={handleFileChange} 
//             />
//           </Box>
//           {selectedFiles.length > 0 && (
//             <Box mt={2}>
//               <Typography variant="subtitle1">Selected Files:</Typography>
//               <ul>
//                 {selectedFiles.map((file, index) => (
//                   <li key={index}>{file.name}</li>
//                 ))}
//               </ul>
//             </Box>
//           )}
//         </Box>
//       )}
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: '#f5d949',
//               color: 'black',
//               height: '28px',
//               width: '100%',
//               '&:hover': {
//                           backgroundColor: '#113163',
//                           color: 'white',
//                         }
//             }}
//             type="submit"
//           >
//             Submit
//           </Button>
//         </Box>
//       </Box>
//     </>
//   )
// }

// export default RightComponent
