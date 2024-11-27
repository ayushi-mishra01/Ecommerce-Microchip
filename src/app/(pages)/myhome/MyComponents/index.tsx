'use client';
import React, { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Layout from '../components/Layout';
// import Menu from '../components/Menu';
import Box from '@mui/material/Box'
import TopSlider from './TopSlider';
import Features from './Features';
import FeaturedProductSlider from './FeaturedProductSlider';
import ColumnLayout from './ColumnLayout';
import Services from './Services';
import News from './News';
import axios from 'axios';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import image1 from './Home_images/image1.jpg';
import image2 from './Home_images/image2.webp';
import image3 from './Home_images/image3.webp';
import image4 from './Home_images/image4.jpg';
import image5 from './Home_images/image5.jpg';
import image6 from './Home_images/image6.jpg';
import image7 from './Home_images/image7.jpg';
import image8 from './Home_images/image8.png';
import image9 from './Home_images/image9.jpg';
import image10 from './Home_images/image10.png';
import image11 from './Home_images/image11.png';
import image12 from './Home_images/image12.png';
import image16 from './Home_images/image16.png';
import image17 from './Home_images/image17.png';
import logo1 from './Home_images/logo1.svg';
import logo2 from './Home_images/logo2.svg';
import logo3 from './Home_images/logo3.svg';
import logo4 from './Home_images/logo4.svg';

import { CircularProgress, Grid} from '@mui/material'
import styles from './index.module.scss';
import LogoSlider from './LogoSlider';


const cardData = [
  {
    title: 'EXPERT COMPONENT SUPPLIER',
    slug: "component-supplier",
    description: 'Our Expert Suppliers of ICs can fight your supply chain battles. We Keep your projects rolling and your production on schedule.',
    image: image1.src,
  },
  {
    title: 'QUALITY CONTROL',
    slug: "quality-control",
    description: 'All Microchip USA components are tested using a selection of leading third-party labs to ensure accuracy & unbiased results.',
    image: image2.src,
  },
  {
    title: 'MANAGE YOUR EXCESS INVENTORY',
    slug: "excess-inventory",
    description: 'Our team of IC Supplying Experts and an extensive network of purchasing partners can turn your unused inventory into revenue.',
    image: image3.src
  }
];

const initialItems = [
  // {
  //   id: 0,
  //   img: image4.src,
  //   title: 'XCVU57P-3FSVK2892E',
  //   subHeading: 'AMD',
  //   description: 'IC FPGA VIRTEX-UP 2892BGA',
  // },
  // {
  //   id: 0,
  //   img: image5.src,
  //   title: 'XC4VFX140-11FFG1517C',
  //   subHeading: 'AMD',
  //   description: 'IC FPGA 768 I/O 1517FCBGA',
  // },
  // {
  //   id: 0,
  //   img: image6.src,
  //   title: 'XC5VTX150T-1FFG1759I',
  //   subHeading: 'AMD',
  //   description: 'IC FPGA 680 I/O 1759FCBGA',
  // },
  // {
  //   id: 0,
  //   img: image7.src,
  //   title: 'XC5VTX150T-2FFG1156C',
  //   subHeading: 'AMD',
  //   description: 'IC FPGA 360 I/O 1156FCBGA',
  // },
  // {
  //   id: 0,
  //   img: image8.src,
  //   title: 'BCM49508B1IFSBG',
  //   subHeading: 'Broadcom Limited',
  //   description: 'Microprocessor IC',
  // },
  // {
  //   id: 0,
  //   img: image8.src,
  //   title: '5AGXFB7K4F40I3G',
  //   subHeading: 'Intel',
  //   description: 'Arria V GX FPGA',
  // },
];

const sectionData = [
  {
    icon: logo1,
    heading: 'Increased Availability',
    text: "Microchip USA's manufacturing network allows us to reroute unused inventory to our clients who need it."
  },
  {
    icon: logo2,
    heading: 'Third-Party Testing',
    text: 'We understand the importance of quality and transparency, which is why we use certified third-party labs.'
  },
  {
    icon: logo3,
    heading: 'Data Driven Solutions',
    text: "Microchip USA's data provides our clients access to critical information on demand, pricing, and availability."
  },
  {
    icon: logo4,
    heading: 'Constant Collaboration',
    text: 'Our team works hand in hand with our clients to develop a solution that fits their specific needs.'
  }
];

const initialBoxData = [
  {
    title: '',
    image: image17.src,
    items: ['Hydraulics', 'Panel Meters', 'Pneumatics', 'Programmable Logic Controller(PLC)', 'Temperature Controllers']
  },
  {
    title: 'Circuit Protection',
    image: image16.src,
    items: ['Circuit Breakers', 'ESD and Circuit Protection ICs', 'Fuse Holders', 'Fuses', 'PTC Resettable Fuses', 'TVS Diodes', 'Varistors']
  },
  {
    title: 'Tools and Supplies',
    image: image16.src,
    items: ['Anti-Static Control', 'Chemicals', 'Enclosures', 'FlashLights', 'Hand Tools', 'Prototype Boards and BreadBoards', 'Raw Materials', 'Soldering Supplies and Tools', 'Storage Bins', 'Wire Crimpers and Strippers']
  },
  {
    title: 'Discrete Semiconductors',
    image: image16.src,
    items: ['Diodes', 'Thyristors', 'Transistors']
  },
  {
    title: 'Machining',
    image: image16.src,
    items: ['Indexable Inserts', 'Indexable Tools', 'Machine Cutting Tools', 'Machine Fuids', 'Machine Tool Accessories', 'Machinery']
  },
  {
    title: 'Optoelectronics',
    image: image16.src,
    items: ['Displays', 'Fiber Optics', 'LEDs', 'Lamps', 'Laser Products', 'Optocouplers']
  },
  {
    title: 'Test Equipments',
    image: image16.src,
    items: ['BenchTop Power Supplies', 'Function Generators', 'Multimeters', 'Oscilloscopes', 'Spectrum Analyzers', 'Test Probes, Leads and Clips', 'Thermometers']
  },
  {
    title: 'Integrated Circuits(ICs)',
    image: image16.src,
    items: ['Clock and Timing', 'Data Converter ICs', 'Embedded Prcessors and', 'Controllers', 'Interface ICs', 'Linear ICs', 'Logic ICs', 'Memory', 'Power management ICs', 'RF semiconductors and Devices']
  },
  {
    title: 'Cables and Wires',
    image: image16.src,
    items: ['Audio/Video Cables', 'Bulk Hook-up Wire', 'Bulk Multiple Conductor Cables', 'Coaxial/RF Cable Assemblies', 'D-Sub Cables', 'Ethernet Cables', 'FFC/FPC Cables', 'Fiber Optics Cables', 'Flat Ribbon Cables', 'USB Cables', 'Wire Protection and Mangement']
  },
  {
    title: 'Sensors',
    image: image16.src,
    items: ['Current Sensors', 'Flow Sensors', 'Magnetic Sensors', 'Motion Sensors', 'Optical Sensors', 'Pressure Sensors', 'Proximity Sensors', 'Temperature and Humidity Sensors']
  },
  {
    title: 'ElectroMechanical',
    image: image16.src,
    items: ['Audio Products', 'Motors and Drives', 'Relays', 'Switches', 'Thermal Management']
  },
  {
    title: 'Connectors',
    image: image16.src,
    items: ['Audio/Video Connectors', 'Automotive Connectors', 'Backplane Connectors', 'Board to Board Connectors', 'Card Edge Connectors', 'Circular Connectors', 'D-Sub Connectors', 'FFC/FPC', 'Fiber Optics Connectors', 'Headers and Wire Housings', 'IC and Component Sockets', 'Memory Connectors', 'Modular/Ethernet Connectors', 'Photovoltaic/ Solar Connectors', 'Power Connectors', 'RF/Coaxial Connectors', 'Terminal Blocks', 'Terminals', 'USB Connectors', 'rf']
  },
  {
    title: 'Power Products',
    image: image16.src,
    items: ['Batteries and Accessories', 'DC to AC Inverters', 'Power Supply Modules', 'Surge Protectors', 'Uninterruptibel Power Supply(UPS)']
  },
  {
    title: 'Hardware Fasteners',
    image: image16.src,
    items: ['Anchors', 'Screws and Fasteners', 'Spacers', 'Standoffs', 'Threaded Inserts', 'Washers']
  },
  {
    title: 'Passive Components',
    image: image16.src,
    items: ['Capacitors', 'Crystals and Oscillators', 'EMI/RFI Components', 'Inductors', 'Resistors', 'Transformers']
  },
];

const ourServices = [
  {
    title: "Excess Inventory",
    slug: "excess-inventory",
    img: image3.src,
    description: "We use our sales and marketing channels to assist OEMs and CMs with selling their unused inventory."
  },
  {
    title: "Quality Control",
    slug: "quality-control",
    img: image2.src,
    description: "All components are tested using industry-leading third-party labs to ensure authenticity and unbiased results."
  },
  {
    title: "Component Supplier",
    slug: "component-supplier",
    img: image1.src,
    description: "Our Expert Suppliers of ICs can fight your supply battles. We keep your projects rolling and your production on schedule."
  },
  {
    title: "Tail Spend Management",
    slug: "tail-spend-management",
    img: image9.src,
    description: "We’ll take care of the little things so you can focus on the critical details that keep your company running."
  }
];

const newsItems = [
  {
    image: image10.src,
    title: 'Earthquake Strikes Taiwan Causing Supply Chain Disruptions',
    url: `/industry-news/earthquake-strikes-taiwan-causing-supply-chain-disruptions`,
    source: 'Industry news',
    date: 'July 18, 2024',
    description: `An intense earthquake with a magnitude of 7.4 on the Richter scale struck Taiwan,
      causing extensive damage and significant disruptions to the global supply chain.
      The earthquake occurred on April 3rd, 2024 at 3:47 AM local time near the city of
      Hualien in eastern Taiwan and was felt throughout the entire island. This
      devastating event`,
  },
  {
    image: image11.src,
    title: `AMD Announces Discontinuation of Xilinx CPLD
      and Lower-End FPGA Models: What It Means for
      the Industry`,
    url: `/industry-news/amd-announces-discontinuation-of-xilinx-cpld-and-lower-end-fpga-models-what-it-means-for-the-industry`,
    source: 'Industry news',
    date: 'July 18, 2024',
    description: `In a move that has stirred both curiosity and concern within the electronic
      component industry, AMD has issued a product discontinuation notice for several
      Xilinx Complex Programmable Logic Devices (CLPD) and lower-end FPGA
      models. The Last Time Buy for these parts is June 29th, 2024. This announcement
      marks a significant shift in AMD’s product strategy…`,
  },
  {
    image: image12.src,
    title: `UK Semiconductor Institute to Support National Semiconductor Strategy`,
    url: `/industry-news/uk-semiconductor-institute-to-support-national-semiconductor-strategy`,
    source: 'Industry news',
    date: 'July 18, 2024',
    description: `The UK government has revealed the establishment of the UK Semiconductor
      Institute, a growth in the semiconductor industry in the country. This formed
      independent institute will bring together entities, universities, and private
      businesses that play a vital role in advancing the National Semiconductor
      Strategy with a financial backing of £1 billion. A Unified Initiative The…`,
  },
];
// const Home: React.FC = () => {
const Home = () => {
  const [boxesData, setBoxData] = useState(initialBoxData);
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      setLoading(true)
      fetchCategories();
      fetchFeaturedProducts();
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Categories`);
      const categories = response.data;
      const categoryMap = new Map(categories.map((cat: { categoryId: any; }) => [cat.categoryId, cat]));
      const transformedData = categories
        .filter((category: { parentCategoryId: null; }) => category.parentCategoryId === null)
        .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
        .map((parentCategory: { categoryId: any; name: any; }) => {
          const childCategories = categories
            .filter((cat: { parentCategoryId: any; }) => cat.parentCategoryId === parentCategory.categoryId)
            .map((cat: { name: any; categoryId: any; }) => ({
              name: cat.name,
              id: cat.categoryId
            }))
            .sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
          return {
            title: parentCategory.name,
            image:image16.src,
            id: parentCategory.categoryId,
            items: childCategories,
            is: childCategories.length != 0 ? true : false
          };
        });
      setBoxData(transformedData);
      console.log("box data:", transformedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.response) {
        console.error('Response error:', error.response);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Other error:', error.message);
      }
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_PUBLISHED_API_URL}/api/Products/GetProductForFeaturedProducts?pageNumber=1&pageSize=15`
        //`https://localhost:7053/api/Products/GetProductForFeaturedProducts?pageNumber=1&pageSize=15`
      );
      const products = response.data.products;
      setItems(products.map((product) => {
        // const product = products[index];
        return {
          ...product,
          id: product.productId,
          sku: product.sku,
          manufacturerSlug: product.manufacturerSlug,
          categorySlug: product.categorySlug,
          description: product.shortDescription ,
          title: product.name ,
          img: product.pictureUrl,
          subHeading: product.manufacturerName 
        };
      }));

      console.log("items:", items);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Check if it's a CORS issue or network issue
      if (error.response) {
        console.error('Response error:', error.response);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Other error:', error.message);
      }
    }
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
  if (error) return <p>{error}</p>

  return (
    <>
    <div className={styles.container}>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <TopSlider cards={cardData} />
        </Grid>
        <Grid >
          <Features sectionData={sectionData} />
        </Grid>
      </Grid>
      <FeaturedProductSlider items={items} />
      <LogoSlider/>
      <Services ourServices={ourServices} />
      <News newsItems={newsItems} />
      </div>
    </>
  );
};

export default Home;
