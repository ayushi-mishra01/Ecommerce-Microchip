import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { useTheme, useMediaQuery, Link } from '@mui/material';
import styles from './index.module.scss';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const LogoSlider = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const slidesToShow = isSmallScreen ? 1 : isMediumScreen ? 2 : 4;

    const settings = {
        dots: true,
        infinite: true,
        speed: 1950,
        slidesToShow, 
        slidesToScroll: slidesToShow, 
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

  const logos = [
    { src: '/images/altera-300x68.png', alt: 'altera' },
    { src: '/images/intel-300x108.png', alt: 'intel' },
    { src: '/images/Xilinx_logo.svg-300x61.png', alt: 'Xilinx_logo' },
    { src: '/images/amd.png', alt: 'amd' },
    { src: '/images/Texas-Instruments-Brands-Logo-PNG-Transparent-300x90.png', alt: 'Texas' },
    { src: '/images/Logo-Cypress-1-300x93.png', alt: 'Cypress' },
    { src: '/images/NXP-Logo.svg-300x120.png', alt: 'NXP' },
    { src: '/images/Marvell_Logo.svg', alt: 'NXP' },
    { src: '/images/lattice.png', alt: 'Marvell' },
    { src: '/images/microsemi-logo-1.png', alt: 'microsemi' },
    // { src: '/images/amd.png', alt: 'Cypress' },
    // { src: '/images/altera-300x68.png', alt: 'Lattice Semiconductor' },
];

  return (
    <>
      <div className={styles.sliderContainerLogo}>
        <div className="content-container">
          <p className={`${styles.sliderTextLogo} accentFont`}>
            We specialize in providing our clients <br/>difficult-to-find components from:
          </p>
          <div>
            <Slider {...settings}>
              {logos.map((logo, index) => (
                <div key={index} className={styles.slideLogo}>
                  <Image src={logo.src} alt={logo.alt} width={230} height={150} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      {/* Talk to an expert */}
      <section className={styles.expertSupplierSection}>
        <div className="content-container">
          <p className={styles.subheading}>Need help with parts? Supply chain got you down?</p>
          <h1 className={styles.heading}>Talk to an Expert Supplier of ICs now!</h1>
          <Link href="/rfq"><button className={styles.ctaButton}>FIND YOUR PART NOW</button></Link>
        </div>
    </section>
    </>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={`${styles.arrow} ${styles.slickNext}`} onClick={onClick}>
      <ChevronRightIcon />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={`${styles.arrow} ${styles.slickPrev}`} onClick={onClick}>
      <ChevronLeftIcon />
    </div>
  );
};

export default LogoSlider;
