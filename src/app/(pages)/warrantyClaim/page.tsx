'use client';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Box, Typography, Link, Button } from '@mui/material'

const WarrantyClaimForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    poIssuerCompany: '',
    salesOrder: '',
    purchaseOrder: '',
    partNumbers: '',
    dateCodes: '',
    affectedQuantity: '',
    requestType: 1,
    description: '',
    files: [],
  });
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('');



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'requestType' ? parseInt(value) : value,
    });
  };

  const allowedFileExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Filter valid files
    const validFiles = files.filter((file) => {
      const typedFile = file as File;

      // Check if file.name is a string and not empty
      if (typeof typedFile.name === 'string' && typedFile.name.trim() !== '') {
        const extension = typedFile.name.split('.').pop().toLowerCase();
        return allowedFileExtensions.includes(`.${extension}`);
      }
      return false;
    });


    if (validFiles.length < files.length) {
      showDialog('Some files were not accepted. Please upload only .pdf, .jpg, .jpeg, .png,  files.', 'error');
    }

    setFormData({
      ...formData,
      files: [...formData.files, ...validFiles],
    });
  };



  const showDialog = (message, type) => {
    setDialogMessage(message);
    setDialogType(type);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const hoverStyle = {
    transition: 'background-color 0.3s ease, color 0.3s ease',
    cursor: 'pointer',
  };

  const formatFileSize = (size) => {
    return size < 1024 * 1024
      ? `${(size / 1024).toFixed(2)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const removeFile = (index) => {
    const updatedFiles = formData.files.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      files: updatedFiles,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((file) => {
          data.append('files', file);
        });
      } else {
        data.append(key, value.toString());
      }
    });
    console.log(formData);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/WarrantyClaims`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Success:', response.data);
      showDialog('Submission successful!', 'success');
      setLoading(false);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      showDialog('Submission failed: ' + (error.response ? error.response.data : error.message), 'error');
      setLoading(false);
    }
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
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          width: '99.3vw',
          backgroundColor: '#113163',
          padding: '10px 20px',
          height: '6rem',
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
              Warranty Claim
            </Typography>
            <Box sx={{
              display: 'flex', alignItems: 'center', width: '20rem',
              // justifyContent: 'flex-end'
            }}>
              <Link href="/">
                <Button
                  variant="text"
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
              <Typography variant="body1" sx={{ color: '#d1d5db', fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <ArrowRightIcon fontSize="small" />
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  // whiteSpace: 'nowrap',
                  // overflow: 'hidden',
                  // textOverflow: 'ellipsis',
                  // mt: '3px', 
                  fontSize: '0.75rem',
                  p: 0,
                  // '&:hover': {
                  //   color: 'white', 
                  // },
                }}
              >
                Warranty Claim
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <h3 style={{ textAlign: 'center' }}>Client Warranty Claim</h3>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', border: '2px solid black' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Request Form</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {/* Contact Information */}
          <h4>Contact Information</h4>
          <hr style={{ border: '1px solid grey', margin: '2px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>First Name (Required)</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: '1' }}>
              <label>Last Name (Required)</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>Phone (Required)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: '1' }}>
              <label>Email (Required)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
          <div>
            <label>PO Issuer Company (Required)</label>
            <input
              type="text"
              name="poIssuerCompany"
              value={formData.poIssuerCompany}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Order Information */}
          <h4>Order Information</h4>
          <hr style={{ border: '1px solid grey', margin: '2px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>Microchip USA Sales Order # (Required)</label>
              <input
                type="text"
                name="salesOrder"
                value={formData.salesOrder}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: '1' }}>
              <label>Client Purchase Order #</label>
              <input
                type="text"
                name="purchaseOrder"
                value={formData.purchaseOrder}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          {/* Return Information */}
          <h4>Return Information</h4>
          <hr style={{ border: '1px solid grey', margin: '2px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>Part Number(s) (Required)</label>
              <input
                type="text"
                name="partNumbers"
                value={formData.partNumbers}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>Date Code(s) (Required)</label>
              <input
                type="text"
                name="dateCodes"
                value={formData.dateCodes}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ flex: '1' }}>
              <label>Affected Quantity</label>
              <input
                type="number"
                name="affectedQuantity"
                value={formData.affectedQuantity}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          {/* Request Type, Description, and Evidence */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>Request Type (Required)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>
                  <input
                    type="radio"
                    name="requestType"
                    value={482300000}
                    checked={formData.requestType === 482300000}
                    onChange={handleChange}
                  /> Credit
                </label>
                <label>
                  <input
                    type="radio"
                    name="requestType"
                    value={482300002}
                    checked={formData.requestType === 482300002}
                    onChange={handleChange}
                  /> Exchange
                </label>
                <label>
                  <input
                    type="radio"
                    name="requestType"
                    value={482300001}
                    checked={formData.requestType === 482300001}
                    onChange={handleChange}
                  /> Repair
                </label>
              </div>
            </div>
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>Description of Issue (Required)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={{ width: '100%', height: '50%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            {/* Applicable Evidence Section */}
            <div style={{ flex: '1', marginRight: '10px' }}>
              <label>
                Applicable Evidence (Required)
                <span style={{ fontSize: 'small', color: 'gray' }}> Accepted File types- PDF, JPEG</span>
              </label>

              <div
                style={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',

                }}
              >
                <p style={{ margin: 0, color: '#666' }}>Drop files here or</p>
                <label
                  htmlFor="fileUpload"
                  style={{
                    color: '#007bff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    ...hoverStyle,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.backgroundColor = 'violet';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#007bff';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  select files
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  aria-label="File Upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Displaying the list of attached files */}
              {formData.files.length > 0 && (
                <ul>
                  {formData.files.map((file, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        {file.name} - {formatFileSize(file.size)}
                      </span>
                      <FaTrash
                        style={{ color: 'black', cursor: 'pointer' }}
                        onClick={() => removeFile(index)}
                        title={`Delete ${file.name}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
              <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                Max. file size: 100 MB. Please attach any supporting files such as reports, failure analyses, pictures, data, error notifications, etc.
              </p>

            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              backgroundColor: loading ? '#FFC200' : '#FFC200',
              color: 'black',

              border: '1px solid black',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease, color 0.3s ease'
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000223';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFC200';
              e.currentTarget.style.color = 'black';
            }}
          >
            Submit
          </button>
        </form>
      </div>

      {/* Your existing form code */}

      {/* Custom Dialog Box */}
      {dialogVisible && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1000'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <h4>{dialogType === 'success' ? 'Success' : 'Error'}</h4>
            <p>{dialogMessage}</p>
            <button onClick={closeDialog} style={{
              padding: '10px 20px',
              backgroundColor: '#FFC200',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default WarrantyClaimForm;