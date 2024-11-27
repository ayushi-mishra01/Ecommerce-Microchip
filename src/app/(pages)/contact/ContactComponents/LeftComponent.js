import React from 'react';
import { Box, Typography, Link, Stack, Divider } from '@mui/material';
import { LocationOn, Phone, Email } from '@mui/icons-material';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import classes from './index.module.scss'

const LeftComponent = () => {
  return (
    <Box className={classes.contactLeft}>
    <Typography variant="h3" fontWeight="bold" sx={{marginBottom: '25px'}}>
      US Headquarters
    </Typography>

    <Box className="accentFont">
    <Box display="flex" alignItems="center" mb={3} pl={2} borderLeft="3px solid #040A191A">
      <PhoneIcon style={{ color: '#bdbdbd', marginRight: '8px', fontSize: '25px' }} />
      <Box ml={1} className={classes.contactContent}>
        <Typography variant="body2" color="#AFB0B5" fontWeight={600} sx={{fontSize: '17px'}}>
          Call us
        </Typography>
        <Link href="tel:+18882515467" color="#254291" display="block">
          +1-888-251-5467
        </Link>
        <Link href="tel:+18134632988" color="#254291" display="block">
          813-463-2988
        </Link>
      </Box>
    </Box>

    <Box display="flex" alignItems="center" mb={3} pl={2} borderLeft="3px solid #040A191A">
      <EmailIcon style={{ color: '#bdbdbd', marginRight: '8px', fontSize: '25px' }} />
      <Box ml={1} className={classes.contactContent}>
        <Typography variant="body2" color="#AFB0B5" fontWeight={600} sx={{fontSize: '17px'}}>
          Email
        </Typography>
        <Link href="mailto:sales@MicrochipUSA.com" color="#254291" display="block">
          sales@MicrochipUSA.com
        </Link>
        <Link href="mailto:careers@MicrochipUSA.com" color="#254291" display="block">
          careers@MicrochipUSA.com
        </Link>
      </Box>
    </Box>

    <Box display="flex" alignItems="center" mb={3} pl={2} borderLeft="3px solid #040A191A">
      <LocationOnIcon style={{ color: '#bdbdbd', marginRight: '8px', fontSize: '25px' }} />
      <Box ml={1}>
        <Typography variant="body2" color="#AFB0B5" fontWeight={600} sx={{fontSize: '17px'}}>
          Location
        </Typography>
        <Typography color="textPrimary" fontSize='18px'>
          4511 N Himes Ave, Suite 100 <br />
          Tampa, FL 33614
        </Typography>
      </Box>
    </Box>
    </Box>
      <Box mt={2} mb={4}>
        <iframe
          title="US Headquarters Map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d450984.8993495958!2d-82.499943!3d27.984119!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c5286812e1bd%3A0x726359b48bfbbdef!2sMicrochip%20USA!5e0!3m2!1sen!2sus!4v1730972893528!5m2!1sen!2sus"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </Box>

      {/* Germany Office */}
      {/* <Typography variant="h5" fontWeight="bold" gutterBottom>
        Germany
      </Typography>
      <Stack spacing={1} direction="row" alignItems="center">
        <Phone color="primary"/>
        <Link href="tel:+18882515467" underline="hover" color="primary">
          +1-888-251-5467
        </Link>
        <Link href="tel:+493030015566" underline="hover" color="primary">
          +49 030 30015566
        </Link>
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <LocationOn color="primary" />
        <Typography variant="body2">
          Kemperplatz 1/10th Floor, 10785 Berlin Germany
        </Typography>
      </Stack> */}
      <Typography variant="h3" fontWeight="bold" sx={{marginBottom: '25px'}}>
        Germany
        </Typography>

        <Box display="flex" alignItems="center" mb={3} pl={2} borderLeft="3px solid #040A191A">
        <PhoneIcon style={{ color: '#bdbdbd', marginRight: '8px', fontSize: '25px' }} />
        <Box ml={1} className={classes.contactContent}>
            <Typography variant="body2" color="#AFB0B5" fontWeight={600} sx={{fontSize: '17px'}}>
            Call us
            </Typography>
            <Link href="tel:+18882515467" color="#254291" display="block">
            +1-888-251-5467
            </Link>
            <Link href="tel:+493030015566" color="#254291" display="block">
            +49 030 30015566
            </Link>
        </Box>
        </Box>

        <Box display="flex" alignItems="center" mb={3} pl={2} borderLeft="3px solid #040A191A">
        <LocationOnIcon style={{ color: '#bdbdbd', marginRight: '8px', fontSize: '25px' }} />
        <Box ml={1}>
            <Typography variant="body2" color="#AFB0B5" fontWeight={600} sx={{fontSize: '17px'}}>
            Location
            </Typography>
            <Typography color="textPrimary" fontSize='18px'>
            Kemperplatz 1/10th Floor, 10785 Berlin Germany
            </Typography>
        </Box>
        </Box>
      <Box mt={2} mb={4}>
        <iframe
          title="Germany Office Map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d310815.3536554403!2d13.37194!3d52.510906!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851406a033893%3A0x4a118189c11cba13!2sKemperpl.%201%2F10th%20Floor%2C%2010785%20Berlin%2C%20Germany!5e0!3m2!1sen!2sus!4v1730972942187!5m2!1sen!2sus"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </Box>

      {/* Social Media Icons */}
      <Box textAlign="center" mt={4}>
        <Typography variant="body2" mb={1}>
          Find us on social media
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <Link href="https://www.facebook.com/microchipusa" color="inherit">
            <FaFacebookF />
          </Link>
          <Link href="https://twitter.com/MicrochipUSA" color="inherit">
            <FaTwitter />
          </Link>
          <Link href="https://www.instagram.com/microchipusa/" color="inherit">
            <FaInstagram />
          </Link>
          <Link href="https://www.linkedin.com/company/microchip-usa/" color="inherit">
            <FaLinkedinIn />
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};

export default LeftComponent;
