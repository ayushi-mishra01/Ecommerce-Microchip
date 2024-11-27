'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Container, Paper } from '@mui/material';
interface OrderDetails {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  orderItems: {
    orderId: number;
    products: {
      quantity: number;
      unitPrice: number;
      productName: string;
    }[];
  }[];
}

const OrderReceived = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
   // console.log(customerId);

    if (customerId) {
      fetchOrderDetails(customerId);
    } else {
      setError('Order is not placed');
      setLoading(false);
    }
  }, []);

  const fetchOrderDetails = async (customerId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Customer/${customerId}/orders`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data: OrderDetails = await response.json();
     // console.log('Order details:', data);
      setOrderDetails({
        orderId: data.orderId,
        orderDate: data.orderDate,
        totalAmount: data.totalAmount,
        orderItems: data.orderItems,
      });

    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details. Please try again later.');
    } finally {
      setLoading(false);
    }
    localStorage.removeItem('customerId');
  };
  

  if (loading) {
    return (
      <div className="content-container">
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h5" align="center">
          Loading...
        </Typography>
      </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h5" align="center" color="error">
            {error}
          </Typography>
        </Container>
        </div>
    );
  }

  return (
    <div className="content-container">
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      {/* Main Paper Box for styling */}
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#fafafa', borderRadius: '10px' }}>
        {/* Title */}
        <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
          Thank you for your purchase!
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Order Summary */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: 2 }}>
          {orderDetails ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                Order Number: <span style={{ fontWeight: 'normal' }}>{orderDetails.orderId}</span>
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                Date: <span style={{ fontWeight: 'normal' }}>{new Date(orderDetails.orderDate).toLocaleDateString()}</span>
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                Total: <span style={{ fontWeight: 'normal' }}>
                  {orderDetails.totalAmount ? `$${orderDetails.totalAmount.toFixed(2)}` : 'N/A'}
                </span>
              </Typography>
            </>
          ) : (
            <Typography variant="body1" sx={{ color: '#555' }}>
              No order details available.
            </Typography>
          )}
        </Box>

        {/* Order Details */}
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
          Order Details
        </Typography>

        <Paper sx={{ p: 3, borderRadius: '10px', backgroundColor: '#fff', boxShadow: 2 }}>
          {orderDetails?.orderItems?.[0]?.products?.length > 0 ? (
            orderDetails.orderItems[0].products.map((product, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  p: 2,
                  backgroundColor: '#f7f7f7',
                  borderRadius: '8px',
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1" sx={{ color: '#555' }}>
                  {product.productName} <span style={{ color: 'gray', fontSize: '0.875rem' }}>x {product.quantity}</span>
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  ${(product.quantity * product.unitPrice).toFixed(2)} 
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: '#555' }}>
              No products found for this order.
            </Typography>
          )}
        </Paper>

        <Divider sx={{ mt: 4, mb: 4 }} />

        {/* Bottom Text */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Thank you for shopping with us! We hope to see you again.
          </Typography>
        </Box>
      </Paper>
    </Container>
    </div>
  );
};

export default OrderReceived;
