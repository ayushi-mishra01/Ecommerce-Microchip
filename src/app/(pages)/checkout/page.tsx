'use client'
import React, { useEffect, useState } from 'react'
import { Container, Grid, Typography, TextField, MenuItem, Select, Button, Checkbox, FormControlLabel, Box, RadioGroup, Radio, Paper, Stepper, Step, StepLabel, FormGroup, Divider, TextareaAutosize, Link } from '@mui/material'
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'


interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  postalCode?: string;
  phone?: string;
  companyName?: string;
  streetAddress1?: string;
  // Add other fields as needed
  [key: string]: string | undefined;
}

const steps = ['Your Cart', 'Checkout', 'Order Complete']

const Checkout = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [testingOption, setTestingOption] = useState("standard")
  const [additionalServices, setAdditionalServices] = useState({})
  const [shippingAccount, setShippingAccount] = useState(false)
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [salesTaxExemption, setSalesTaxExemption] = useState(false)
  const [partTestingTypes, setPartTestingTypes] = useState([])
  const [partTestingSubTypes, setPartTestingSubTypes] = useState([])
  const [noTestingMessageVisible, setNoTestingMessageVisible] = useState(false);
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    country: '',
    shipToDifferentAddress: false,
    orderNotes: '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      companyName: '',
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    }
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderSubmitLoading, setOrderSubmitLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [shippingStates, setShippingStates] = useState([]);
  const [selectedBillingCountryId, setSelectedBillingCountryId] = useState(0);
  const [selectedShippingCountryId, setSelectedShippingCountryId] = useState(0);

  useEffect(() => {
    document.title='Checkout';
    axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq/countries`)
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);




  useEffect(() => {

    fetch(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/PartTesting`)
      .then(response => response.json())
      .then(data => setPartTestingTypes(data))
      .catch(error => console.error('Error fetching part testing types:', error));

    const cartData = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(cartData);
    calculateSubtotal(cartData);
  }, []);

  useEffect(() => {
    if (testingOption === 'custom testing') {
      fetch(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/PartTesting/subtypes/2`)
        .then(response => response.json())
        .then(data => {
          setPartTestingSubTypes(data)
        })
        .catch(error => console.error('Error fetching part testing subtypes:', error))
    } else {
      setPartTestingSubTypes([])
    }
  }, [testingOption])

  const calculateSubtotal = (cartData) => {
    const total = cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    //console.log('Calculated Subtotal:', total);
    setSubtotal(total)
  }
  useEffect(() => {
    if (selectedBillingCountryId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq/states?countryId=${selectedBillingCountryId}`)
        .then((response) => {
          setBillingStates(response.data);
        })
        .catch((error) => console.error('Error fetching billing states:', error));
    } else {
      setBillingStates([]);
    }
  }, [selectedBillingCountryId]);


  useEffect(() => {
    if (selectedShippingCountryId) {
      axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq/states?countryId=${selectedShippingCountryId}`)
        .then(response => {
          setShippingStates(response.data);
        })
        .catch(error => console.error('Error fetching shipping states:', error));
    } else {
      setShippingStates([]);
    }
  }, [selectedShippingCountryId]);


  const handleBillingCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedBillingCountryId(countryId);
    setFormData((prevData) => ({
      ...prevData,
      country: countryId,
      state: '' // Reset state when country changes
    }));
    if (countryId === 1) {
      // Fetch states for the United States
      axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq/states?countryId=${countryId}`)
        .then(response => {
          setBillingStates(response.data);
        })
        .catch(error => console.error('Error fetching billing states:', error));
    } else {
      setBillingStates([]); // Clear states for other countries
    }
  };

  const handleShippingCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedShippingCountryId(countryId);
    setFormData((prevData) => ({
      ...prevData,
      shippingAddress: {
        ...prevData.shippingAddress,
        country: countryId,
        state: '' // Reset state when country changes
      }
    }));
    if (countryId === 1) {
      // Fetch states for the United States
      axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Rfq/states?countryId=${countryId}`)
        .then(response => {
          setShippingStates(response.data);
        })
        .catch(error => console.error('Error fetching shipping states:', error));
    } else {
      setShippingStates([]); // Clear states for other countries
    }
  };






  const handleStateChange = (e, isShipping = false) => {
    const stateId = e.target.value;
    if (isShipping) {
      setFormData((prevData) => ({
        ...prevData,
        shippingAddress: {
          ...prevData.shippingAddress,
          state: stateId,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        state: stateId,
      }));
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    validateInput(name, value);
  };

  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      shippingAddress: {
        ...prevData.shippingAddress,
        [name]: value
      }
    }));
    validateInput(name, value);
  };


  const handleCheckboxChange = (event) => {
    const { checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      shipToDifferentAddress: checked,
      shippingAddress: checked
        ? {
          ...prevData.shippingAddress,
          firstName: prevData.firstName,
          lastName: prevData.lastName,
          companyName: prevData.companyName,


        }
        : {
          firstName: '',
          lastName: '',
          companyName: '',
          streetAddress1: '',
          streetAddress2: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
        },
    }));
  };

  const handleFileUpload = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleFileClick = () => {
    document.getElementById('fileUpload').click()
  }

  const handleStepClick = index => {
    const urls = [
      `/cart`,
      `/checkout`,
      `/order-received`,
    ]
    router.push(urls[index])
  }

  const handleTestingChange = (event) => {
    const newTestingOption = event.target.value;
    setTestingOption(newTestingOption);

    if (newTestingOption === 'no testing') {
      setNoTestingMessageVisible(true);
    } else {
      setNoTestingMessageVisible(false);
    }

  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (dialogMessage === 'Your order has been placed') {
      router.push('/order-received');
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // Retrieve cart items from local storage (you are already doing this)
  //   const cartData = JSON.parse(localStorage.getItem('cartItems')) || [];

  //     // Prepare order data (for now we'll just simulate order info and log it)
  // const orderData = {
  //   CustomerId: 1, // Assume this comes from your backend or user session
  //   OrderDate: new Date(),
  //   TotalAmount: cartData.reduce((total, item) => total + (item.price * item.quantity), 0), // Calculate total from cart
  //   OrderStatusId: 1, // Assume status 'Pending' as default for now
  //   ShippingAddressId: 123, // Example: Placeholder for Shipping Address Id
  //   BillingAddressId: 123, // Example: Placeholder for Billing Address Id
  //   Active: 1,
  //   CreatedBy: 1, // Assuming this is the user id or admin id
  //   CreatedDate: new Date(),
  //   OrderItems: cartData.map((item) => ({
  //     ProductId: item.productId, // Assuming each cart item has an id matching product id
  //     Quantity: item.quantity,
  //     UnitPrice: item.price,
  //     Name:item.name,
  //     Active: 1,
  //     CreatedBy: 1,
  //     CreatedDate: new Date(),
  //   })),
  // };

  // // Log the orderData to simulate what will be sent to the backend


  //   console.log("Customer Information:", formData);
  //   console.log("Order Data:", orderData);
  //   console.log("checked value-" ,checked1);

  //   // Prepare the billing address data for the A
  //   const billingAddress = {
  //     FirstName: formData.firstName,
  //     LastName: formData.lastName,
  //     CompanyName: formData.companyName,
  //     StreetAddress1: formData.streetAddress1,
  //     StreetAddress2: formData.streetAddress2,
  //     CityId: 2, // Hardcoded based on your needs
  //     StateId: 3,
  //     CountryId: 2,
  //     PostalCode: formData.postalCode,
  //     shipToDifferentAddress: formData.shipToDifferentAddress ,
  //     Phone: formData.phone,
  //     Email: formData.email, // Billing email
  //     AddressType: 'billing',
  //     Active: 1,
  //     CreatedBy: 1, // You can change this based on the logged-in user
  //     CreatedDate: new Date()
  //   };

  //   const shippingAddress = formData.shipToDifferentAddress
  //     ? {
  //         ...billingAddress, // Use same customer email and details
  //         FirstName: formData.shippingAddress.firstName,
  //         LastName: formData.shippingAddress.lastName,
  //         CompanyName: formData.shippingAddress.companyName,
  //         StreetAddress1: formData.shippingAddress.streetAddress1,
  //         StreetAddress2: formData.shippingAddress.streetAddress2,
  //         PostalCode: formData.shippingAddress.postalCode,
  //         AddressType: 'shipping' // Change only the address type
  //       }
  //     : { ...billingAddress, AddressType: 'shipping' };

  //   try {
  //     const payload = {
  //       customerInfo: billingAddress, // Use billing address as customer info
  //       orderData: orderData // Include the order data
  //     };

  //  // Send the customer info and order data
  //  await axios.post('https://localhost:7053/api/Customer', payload);


  //     // If there's a different shipping address, send that too
  //     if (formData.shipToDifferentAddress) {
  //       const payload1 = {
  //         customerInfo: shippingAddress, // Use billing address as customer info
  //         orderData: orderData // Include the order data
  //       };
  //       await axios.post('https://localhost:7053/api/Customer', payload1);
  //     }

  //     setDialogMessage('Your order has been placed');
  //     setDialogOpen(true);
  //   } catch (error) {
  //     console.error('Error submitting form', error);
  //     if (error.response) {
  //       // Handle specific error for email already exists
  //       if (error.response.data === "Email already exists.") {
  //         setDialogMessage('Email already exists');
  //         setDialogOpen(true);
  //       } else {
  //         setDialogMessage('Failed to submit form');
  //         setDialogOpen(true);
  //       }
  //     } else {
  //       setDialogMessage('Failed to submit form');
  //       setDialogOpen(true);
  //     }
  //   }
  // };

  const validateInput = (field, value) => {
    let error = '';

    value = typeof value === 'string' ? value.trim() : '';
    //value = value.trim().replace(/\s+/g, ' ');

    switch (field) {
      case 'firstName':
        if (!value) {
          error = 'First name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
          error = 'First name can only contain letters (e.g., John)';
        }
        break;

      case 'lastName':
        if (!value) {
          error = 'Last name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
          error = 'Last name can only contain letters (e.g., Doe)';
        }
        break;

      case 'email':
        if (!/[a-zA-Z0-9.*%±]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value)) {
          error = 'Email is invalid (e.g., example@mail.com)';
        }
        break;

      case 'companyName':
        if (!value) {
          error = 'Company name is required';
        } else if (!/^[a-zA-Z0-9-@.{}#&!()]+(\s[a-zA-Z0-9-@{}.#&!()]+)*(\s[a-zA-Z-@.#&!()]+)?$/.test(value)) {
          error = 'Company name is invalid (e.g., Example Co. LLC)';
        }
        break;

      case 'postalCode':
        if (!/^[A-Za-z0-9\s-]{3,10}$/.test(value)) {
          error = 'Postal code is invalid (e.g., 12345, 12345-6789, A1A 1A1, SW1A 1AA)';
        }
        break;

      case 'phone':
        if (!/^\+?[0-9\s().-]{7,20}$/.test(value)) {
          error = 'Phone number is invalid; include country code if applicable (e.g., +1 123-456-7890)';
        }
        break;

      case 'streetAddress1':
        if (!value) {
          error = 'Street address is required';
        }
        break;

      case 'streetAddress2':
        if (!value) {
          error = 'Street address line 2 is required';
        }
        break;

      case 'orderNotes':
        if (!value) {
          error = 'Order notes are required.';
        }
        break;

      default:
        break;
    }

    if (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      return error;
    }

    setErrors((prevErrors) => {
      const { [field]: _, ...rest } = prevErrors;
      return rest;
    });
    return null;
  };


  const handleCloseSnackbar = (event) => {
    setOpenSnackbar(false);
  };

  const handleTermsChange = (event) => {
    setTermsAccepted(event.target.checked);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setOrderSubmitLoading(true);

    let hasErrors = false;

    for (const field in formData) {
      const error = validateInput(field, formData[field]);
      if (error) {
        hasErrors = true;
      }
    }
    // If there are errors, do not submit the form
    if (hasErrors) {
      setOpenSnackbar(true);
      setOrderSubmitLoading(false);
      return;
    }
    // No errors, proceed with form submission
    console.log('Form submitted');

    const cartData = JSON.parse(localStorage.getItem('cartItems')) || [];
    const productIDs = cartData.map(item => item.productId).filter(value => value).join(',');
    const quantities = cartData.map(item => item.quantity).filter(value => value).join(',');
    const unitPrices = cartData.map(item => item.price).filter(value => value).join(',');
    const totalAmount = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);

    const orderData = {
      CustomerId: 0,
      OrderDate: new Date(),
      TotalAmount: totalAmount,
      OrderStatusId: 3,
      ShippingAddressId: 0,
      BillingAddressId: 0,
      Active: 1,
      CreatedBy: 1,
      CreatedDate: new Date(),
      OrderItems: cartData.map((item) => ({
        ProductId: item.productId,
        Quantity: item.quantity,
        UnitPrice: item.price,
        Active: 1,
        CreatedBy: 1,
        CreatedDate: new Date(),
      })),
      ProductIds: productIDs,
      Quantities: quantities,
      UnitPrices: unitPrices,
    };

    const billingAddress = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      CompanyName: formData.companyName,
      StreetAddress1: formData.streetAddress1,
      StreetAddress2: formData.streetAddress2,
      City: formData.city,
      State: formData.state.toString(),
      CountryId: formData.country,
      PostalCode: formData.postalCode,
      UserId: 0,
      shipToDifferentAddress: formData.shipToDifferentAddress,
      Phone: formData.phone,
      Email: formData.email,
      AddressType: 'billing',
      OrderNotes: formData.orderNotes,
      Active: 1,
      CreatedBy: 1,
      CreatedDate: new Date(),
      ModifiedBy: 1,
      ModifiedDate: new Date()
    };

    const shippingAddress = formData.shipToDifferentAddress
      ? {
        ...billingAddress,
        FirstName: formData.shippingAddress.firstName,
        LastName: formData.shippingAddress.lastName,
        CompanyName: formData.shippingAddress.companyName,
        StreetAddress1: formData.shippingAddress.streetAddress1,
        StreetAddress2: formData.shippingAddress.streetAddress2,
        PostalCode: formData.shippingAddress.postalCode,
        State: formData.shippingAddress.state.toString(),
        CountryId: formData.shippingAddress.country,
        City:formData.shippingAddress.city,
        AddressType: 'shipping'
      }
      : {
        ...billingAddress,
        AddressType: 'shipping'
      };

    const payload = {
      customerInfoBilling: billingAddress,
      customerInfoShipping: shippingAddress,
      orderData: orderData
    };
    console.log(payload)
    try {
      // Send the payload to API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Customer/add-customerInfo`, payload);
      //setting customer id from backend response of api -customerId/order
      const customerId = response.data.customerId;
      localStorage.setItem('customerId', customerId);

      const pn = localStorage.getItem('numKey');
      const response1 = await axios.post(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/OrderToCRM/add-OrderInfo`, payload, {
        params: { partnumber: pn, orderNotes: formData.orderNotes }
      });
      //console.log(response1.data)
      setDialogMessage('Your order has been placed');
      setDialogOpen(true);
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      console.error('Error submitting form', error);

      if (error.response) {
        if (error.response.data && error.response.data.includes("Email already exists.")) {
          setDialogMessage('Email already exists please use another valid email');
          setDialogOpen(true);
        } else {
          setDialogMessage('Failed to submit form');
          setDialogOpen(true);
        }
      } else {
        setDialogMessage('Failed to submit form');
        setDialogOpen(true);
      }
    }
    finally {
      setOrderSubmitLoading(false);
    }
  };

  const handleServiceChange = (event) => {
    setAdditionalServices({
      ...additionalServices,
      [event.target.name]: event.target.checked,
    })
  }

  const handleShippingAccountChange = (event) => {
    setShippingAccount(event.target.value === 'yes')
  }

  const handleSalesTaxExemptionChange = (event) => {
    setSalesTaxExemption(event.target.value === 'yes')
  }

  const handleTermsClick = () => {
    router.push('/salesterms');
  };

  return (
    <div>
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
              Checkout
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
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ArrowRightIcon fontSize="small" />
              </Typography>
              <Link href="/cart" sx={{ textDecoration: 'none' }}>
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
                  Cart
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
              {/* <Tooltip title={manufacture.name} arrow> */}
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
                Checkout
              </Typography>
              {/* </Tooltip> */}
            </Box>
          </Box>
        </Box>
      </Box>
      <Container maxWidth="lg">

        {/* Stepper Component */}
        <Stepper activeStep={1} alternativeLabel sx={{ mt: 4 }}>
          {steps.map((label, index) => (
            <Step key={label} onClick={() => handleStepClick(index)}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                },
              }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Main Content */}
        <Grid container spacing={4} sx={{ mt: 4, marginBottom: '40px' }}>

          {/* Left Side - User Information */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Your Details
              </Typography>
              <Grid container spacing={2}>

                {/* First and Last Name */}
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>First Name</Typography>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}

                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Last Name</Typography>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    size="small"
                  />
                </Grid>

                {/* Company Name */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Company Name</Typography>
                  <TextField
                    required
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    error={!!errors.companyName}
                    helperText={errors.companyName}
                    size="small"
                  />
                </Grid>

                {/* Country/Region */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Country/Region</Typography>
                  <Select
                    fullWidth
                    name="country"
                    value={formData.country}
                    onChange={handleBillingCountryChange}
                    size="small"
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.countryId} value={country.countryId}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {/* Street Address */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Street Address</Typography>
                  <TextField fullWidth
                    label="House number and street name"
                    name="streetAddress1"
                    value={formData.streetAddress1}
                    onChange={handleInputChange}
                    error={!!errors.streetAddress1}
                    helperText={errors.streetAddress1}
                    size="small"
                  />
                  <TextField fullWidth
                    label="Apartment , suite , unit, etc (optional)"
                    name="streetAddress2" value={formData.streetAddress2}
                    onChange={handleInputChange}
                    sx={{ mt: 2 }}
                    error={!!errors.streetAddress1}
                    helperText={errors.streetAddress1}
                    size="small" />
                </Grid>

                {/* Town / City */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Town / City</Typography>
                  <TextField fullWidth label="City"
                    name="city" value={formData.city}
                    onChange={handleInputChange} size="small" />
                </Grid>

                {/* State */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>State</Typography>
                  {selectedBillingCountryId === 1 ? (
                    <Select
                      fullWidth
                      name="state"
                      value={formData.state}
                      onChange={(e) => handleStateChange(e, false)}
                      size="small"
                    >
                      {billingStates.map((state) => (
                        <MenuItem key={state.stateId} value={state.stateId}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      size="small"
                    />
                  )}
                </Grid>


                {/* ZIP Code */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>ZIP Code</Typography>
                  <TextField fullWidth
                    label="ZIP Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    error={!!errors.postalCode}
                    helperText={errors.postalCode}
                    size="small"
                  />
                </Grid>

                {/* Phone */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Phone</Typography>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    size="small"
                  />
                </Grid>

                {/* Email Address */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Email Address</Typography>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    size="small"
                  />
                </Grid>

                {/* Ship to a Different Address */}
                <Grid item xs={12}>
                  <FormControlLabel
                    sx={{ paddingTop: '50px' }}
                    control={<Checkbox
                      checked={formData.shipToDifferentAddress}
                      onChange={handleCheckboxChange}
                      sx={{ transform: 'scale(0.8)', padding: '2px', marginTop: '-2px' }} />}
                    label="Ship to a different address?"
                  />
                </Grid>

                {/* Conditionally render additional address fields (shipping address details) */}
                {formData.shipToDifferentAddress && (
                  <>
                    {/* First and Last Name */}
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>First Name</Typography>
                      <TextField required fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.shippingAddress.firstName}
                        onChange={handleShippingInputChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        size="small" />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Last Name</Typography>
                      <TextField required
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.shippingAddress.lastName}
                        onChange={handleShippingInputChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        size="small" />
                    </Grid>

                    {/* Company Name */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Company Name</Typography>
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={formData.shippingAddress.companyName}
                        onChange={handleShippingInputChange}
                        error={!!errors.companyName}
                        helperText={errors.companyName}
                        size="small" />
                    </Grid>

                    {/* Country/Region */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Country/Region</Typography>
                      <Select
                        fullWidth
                        name="country"
                        value={formData.shippingAddress.country}
                        onChange={handleShippingCountryChange}
                        size="small"
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.countryId} value={country.countryId}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    {/* Street Address */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Street Address</Typography>
                      <TextField fullWidth label="House number and street name"
                        name="streetAddress1"
                        value={formData.shippingAddress.streetAddress1}
                        onChange={handleShippingInputChange}
                        error={!!errors.streetAddress1}
                        helperText={errors.streetAddress1}
                        size="small" />
                      <TextField fullWidth
                        label="Apartment, suite, unit, etc (optional)"
                        name="streetAddress2"
                        value={formData.shippingAddress.streetAddress2}
                        onChange={handleShippingInputChange}
                        error={!!errors.streetAddress1}
                        helperText={errors.streetAddress1}
                        sx={{ mt: 2 }}
                        size="small" />
                    </Grid>

                    {/* Town / City */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }} >Town / City</Typography>
                      <TextField fullWidth
                        label="City" name="city"
                        value={formData.shippingAddress.city}
                        onChange={handleShippingInputChange}
                        size="small" />
                    </Grid>

                    {/* State */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>State</Typography>
                      {selectedShippingCountryId === 1 ? (
                        <Select
                          fullWidth
                          name="state"
                          value={formData.shippingAddress.state}
                          onChange={(e) => handleStateChange(e, true)}
                          size="small"
                        >
                          {shippingStates.map((state) => (
                            <MenuItem key={state.stateId} value={state.stateId}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <TextField
                          fullWidth
                          label="State"
                          name="state"
                          value={formData.shippingAddress.state}
                          onChange={handleShippingInputChange}
                          size="small"
                        />
                      )}
                    </Grid>
                    {/* ZIP Code */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>ZIP Code</Typography>
                      <TextField
                        fullWidth
                        label="ZIP Code"
                        name="postalCode"
                        value={formData.shippingAddress.postalCode}
                        onChange={handleShippingInputChange}
                        error={!!errors.postalCode}
                        size="small" />
                    </Grid>
                  </>
                )}

                {/* Order Notes */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ paddingTop: '50px', fontWeight: 'bold' }} >
                    Order notes (Required)

                  </Typography>
                  <textarea
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      minHeight: '60px',
                      maxHeight: '200px',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: errors.orderNotes ? '1px solid red' : 'none',
                    }}
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    value={formData.orderNotes}
                    onChange={(e) => handleInputChange(e)}
                    name="orderNotes"
                    required
                  />
                  {errors.orderNotes && <p style={{ color: 'red' }}>{errors.orderNotes}</p>}
                  {/* Error message */}
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Side - Order Summary */}

          {/* <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                padding: 2,
                borderRadius: 2,
                marginBottom: 2,
              }}
            >
              <Typography variant="h6" gutterBottom
                sx={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '20px' }}>
                Part Testing
              </Typography>
              <RadioGroup value={testingOption} onChange={handleTestingChange}>
                {partTestingTypes.map(testingType => (
                  <FormControlLabel
                    key={testingType.id}
                    value={testingType.name.toLowerCase()}
                    control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18, }, }} />}
                    label={`${testingType.name} - Cost: $${testingType.price}`}
                  />
                ))}
                 {testingOption === 'standard testing' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Standard Testing Includes:
                  </Typography>
                  <FormGroup>
                    {[
                      'Packaging Inspection',
                      'X-ray Analysis',
                      'Decapsulation',
                      'Electrical/Functional',
                    ].map((testName) => (
                      <FormControlLabel
                        key={testName}
                        control={
                          <Checkbox
                            checked
                            disabled
                            sx={{ transform: 'scale(0.8)', padding: '2px' }}
                          />
                        }
                        label={testName}
                      />
                    ))}
                  </FormGroup>
                </Box>
              )}
                {testingOption === 'custom testing' && (
                  <Box sx={{ mt: 2 }}>

                    <FormGroup>
                      {partTestingSubTypes.map(subType => (
                        <FormControlLabel
                          key={subType.id}
                          control={<Checkbox sx={{ transform: 'scale(0.8)', padding: '2px' }}
                            name={subType.name}
                            checked={additionalServices[subType.name] || false}
                            onChange={handleServiceChange} />}
                          label={`${subType.name} - $${subType.price}`}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                )}

              </RadioGroup>
              {testingOption === 'no testing' && noTestingMessageVisible && (
                <Box sx={{
                  backgroundColor: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  color: '#721c24', padding: 2, borderRadius: 1, marginBottom: 2
                }}>
                  <Typography variant="body2">
                    <strong>NOTE:</strong> The Microchip USA Part Guarantee is contingent upon thorough
                    testing, verification of part identities, and assurance of
                    quality. This guarantee is applicable solely when these
                    conditions are met, and not available when "No Testing" is chosen.
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" color="textSecondary" sx={{paddingTop:'20px'}}>
                Testing cost(s) are calculated after the order is placed. The operation
                team at Microchip USA will reach out post-order to finalize details and confirm cost.
              </Typography>
            </Box> */}

          <Grid item xs={12} md={6}>
            {/* Part Testing */}
            <Box
              sx={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                padding: 2,
                borderRadius: 2,
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '20px' }}
              >
                Part Testing
              </Typography>

              <RadioGroup value={testingOption} onChange={handleTestingChange}>
                {partTestingTypes.map((testingType) => (
                  <FormControlLabel
                    key={testingType.id}
                    value={testingType.name.toLowerCase()}
                    control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                    // label={testingType.name==='standard testing'?`${testingType.name}`:testingType.name==='custom testing'?`${testingType.name} - Cost(s) is added to the order`:""}
                    label={testingType.name.toLowerCase() === 'standard testing'
                      ? `${testingType.name} - FREE for line-items over $2,000 (Approx. $750 test cost.).`
                      : testingType.name.toLowerCase() === 'custom testing'
                        ? `${testingType.name} - Cost(s) is added to the order`
                        : `${testingType.name}`}

                  />
                ))}

                {/* Show additional services as text when Standard Testing is selected */}
                {/* {testingOption === 'standard testing' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Standard Testing Includes:
                      </Typography>
                      <ul style={{ paddingLeft: '20px', marginTop: '10px', listStyleType: 'disc' }}>
                        <li>Packaging Inspection</li>
                        <li>X-ray Analysis</li>
                        <li>Decapsulation</li>
                        <li>Electrical/Functional</li>
                      </ul>
                    </Box>
                  )} */}
                {testingOption === 'standard testing' && (
                  <Box sx={{ mt: 2, paddingLeft: 3 }}>
                    <Typography variant="body1">Packaging Inspection</Typography>
                    <Typography variant="body1">X-ray Analysis</Typography>
                    <Typography variant="body1">Decapsulation</Typography>
                    <Typography variant="body1">Electrical/Functional</Typography>
                  </Box>
                )}

                {/* Custom Testing Options */}
                {testingOption === 'custom testing' && (
                  <Box sx={{ mt: 2 }}>
                    <FormGroup>
                      {partTestingSubTypes.map((subType) => (
                        <FormControlLabel
                          key={subType.id}
                          control={
                            <Checkbox
                              sx={{ transform: 'scale(0.8)', padding: '2px' }}
                              name={subType.name}
                              checked={additionalServices[subType.name] || false}
                              onChange={handleServiceChange}
                            />
                          }
                          label={`${subType.name}`}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                )}
              </RadioGroup>

              {/* Warning message for No Testing */}
              {testingOption === 'no testing' && noTestingMessageVisible && (
                // <Box
                //   sx={{
                //     backgroundColor: '#f8d7da',
                //     border: '1px solid #f5c6cb',
                //     color: '#721c24',
                //     padding: 2,
                //     borderRadius: 1,
                //     marginBottom: 2,
                //   }}
                // >
                //   <Typography variant="body2">
                //     <strong>NOTE:</strong> The Microchip USA Part Guarantee is contingent upon thorough testing,
                //     verification of part identities, and assurance of quality. This guarantee is applicable solely when these
                //     conditions are met, and not available when "No Testing" is chosen.
                //   </Typography>
                // </Box>
                <Box
                  sx={{
                    backgroundColor: '#fff',
                    border: '2px solid #dc3545',
                    color: '#000',
                    padding: '16px',
                    borderRadius: '4px',
                    marginTop: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <Typography variant="body2" component="div" sx={{ color: '#000', fontSize: '14px' }}>
                    <strong style={{ fontWeight: 'bold' }}>NOTE :</strong>
                    The Microchip USA Part Guarantee is contingent upon thorough testing, verification of part identities,
                    and assurance of quality. This guarantee is applicable solely when these conditions are met, and not available
                    when "No Testing" is chosen.
                  </Typography>
                </Box>

              )}

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ paddingTop: '20px' }}
              >
                Testing cost(s) are calculated after the order is placed. The operations
                team at Microchip USA will reach out post-order to finalize details and confirm cost.
              </Typography>
            </Box>

            {/* Your Order Summary */}
            <Box
              sx={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom
                sx={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '20px' }}>
                Your order
              </Typography>
              {cartItems.map(item => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">
                    {item.name} <span style={{ color: 'gray', fontSize: '0.875rem' }}>x {item.quantity}</span>
                  </Typography>
                  <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />

              {/* Subtotal */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              {/* Shipping Account */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">
                  <span style={{ color: 'black' }}>Shipping</span>
                  <span style={{ color: 'gray' }}>Use my shipping account</span>
                </Typography>
                <RadioGroup row sx={{ ml: 2 }} value={shippingAccount ? 'yes' : 'no'}
                  onChange={handleShippingAccountChange}>
                  <FormControlLabel value="yes"
                    control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18, }, }} />}
                    label="Yes" />
                  <FormControlLabel value="no"
                    control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18, }, }} />}
                    label="No" />
                </RadioGroup>
              </Box>
              {shippingAccount && (
                <Box sx={{ pl: 4 }}>
                  <TextField fullWidth label="Shipping Method" sx={{ mb: 2 }} size="small" />
                  <TextField fullWidth label="Freight Account Number" size="small" />
                </Box>
              )}
              <Divider sx={{ my: 1 }} />

              {/* Sales Tax Exemption */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  <span style={{ color: 'black' }}>Sales Tax Exemption</span>
                  <span style={{ color: 'gray' }}>Use my sales tax exemption cert</span>
                </Typography>
                <RadioGroup row sx={{ ml: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                  value={salesTaxExemption ? 'yes' : 'no'} onChange={handleSalesTaxExemptionChange}>
                  <FormControlLabel value="yes"
                    control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18, }, }} />}
                    label="Yes" />
                  <FormControlLabel value="no"
                    control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18, }, }} />}
                    label="No" />
                </RadioGroup>
              </Box>
              {salesTaxExemption && (
                <Box sx={{ pl: 4 }}>
                  <Button variant="contained" component="label">
                    Upload Sales Tax Exemption Certificate
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />

              {/* Total */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Total</Typography>
                <Typography variant="h6">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              {/* Additional Information */}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Once product availability is confirmed (normally within 24 hours),
                Microchip USA Operations staff will contact you to arrange for payment
                and shipping, as well as to address any specific requirements related to your order.
              </Typography>
              <Divider sx={{ my: 1 }} />

              {/* Terms and conditions */}
              <FormControlLabel
                control={<Checkbox checked={termsAccepted}
                  onChange={handleTermsChange} sx={{ transform: 'scale(0.8)', padding: '2px', marginTop: '-25px' }} />}
                label={
                  <Typography>
                    I have read and agree to the Microchip USA online sales{' '}
                    <span
                      onClick={handleTermsClick}

                      style={{
                        textDecoration: 'none',
                        color: 'blue',
                        cursor: 'pointer'
                      }}
                    >
                      terms and conditions
                    </span>.
                  </Typography>
                }
              />
              {/* Place order button */}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FFD700',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#FFC107',
                  },
                  mt: 2,
                }}
                fullWidth
                onClick={handleSubmit}
                disabled={orderSubmitLoading || !termsAccepted}
              >
                {orderSubmitLoading ? (
                  <>
                    <CircularProgress size={24} sx={{ color: 'white', marginRight: '0.5rem' }} />
                    PLACE ORDER
                  </>
                ) : (
                  'PLACE ORDER'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog for showing success or error messages */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar to display errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Please correct the following errors:
          <ul>
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      </Snackbar>
      </div>
    </div>
  )
}

export default Checkout