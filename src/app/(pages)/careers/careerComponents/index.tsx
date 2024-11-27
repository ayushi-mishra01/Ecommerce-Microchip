'use client'
import React, { useEffect } from 'react';
import styles from './index.module.scss'; 
import officeImage from './Image/img.jpg';

import {Box, Typography, Button, Link } from '@mui/material'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

export default function Careers() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://scripts.teamtailor-cdn.com/widgets/na-maroon/jobs.js";
        script.async = true;
        script.charset = "utf-8";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <>
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
            Microchip USA Careers
            </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '20rem', 
                }}>
                <Link href="/">
                    <Button
                    variant="text"
                    sx={{
                        textTransform: 'none',
                        color: '#d1d5db', 
                        fontSize: '0.75rem',
                        mr: '-15px',
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
                    fontSize: '0.75rem',
                    p: 0,
                    }}
                >
                    Microchip USA Careers
                </Typography>
                </Box>
            </Box>
        </Box>
        </Box>
            <div className={styles.careerPage}>
                <header className={styles.header}>
                    <h1>Microchip USA Hiring</h1>
                </header>
                
                <div className={`${styles.content} accentFont`}>
                    <div className={styles.widgetContainer}>
                        <p>
                        <img
                            className={styles.image} 
                            decoding="async"
                            src={officeImage.src}
                            // src="https://www.microchipusa.com/wp-content/uploads/2023/09/P1010525-300x225.jpg"
                            alt=""
                            width="300"
                            height="225"
                        />
                        Welcome to the career hub of Microchip USA, where we work every day to
                        keep the electronics supply chain moving for our partners and clients.
                        At Microchip USA, we’re not just experiencing rapid growth; we’re
                        defining it. Our journey as a trailblazing force in the industry is
                        fueled by a collective passion, drive, and an unyielding commitment to
                        transparency, innovation, and efficiency.
                        </p>
                        <p>
                        But what truly sets us apart is our unwavering emphasis on our most
                        valuable asset: our employees. With an 'employee-first' philosophy
                        embedded at the core of our culture, we prioritize the well-being,
                        professional development, and aspirations of every team member. Here,
                        your growth is intertwined with ours, and together, we envision a world
                        powered by revolutionary technology and the minds behind it.
                        </p>
                        <p>
                        Browse through our available positions and take the first step towards
                        being a part of a family that champions talent, nurtures potential, and
                        celebrates milestones together. Join us, and let’s shape the future,
                        one microchip at a time.
                        </p>
                    </div>
                </div>
                
                {/* <section className={styles.positions}>
                    <div className={styles.header}>
                    <h1>Available Positions:</h1>
                    </div>
                    <ul>
                        <li>
                            <Link href="https://careers.microchipusa.com/jobs/56188-sales-executive-ic-semiconductor-specialist?utm_campaign=jobs-widget&utm_source=careers.microchipusa.com&utm_content=jobs&utm_medium=web&_gl=1*923dto*_up*MQ..*_ga*MjE2NDU3NzExLjE3MzA3MjAxMjg.*_ga_81K476YCEJ*MTczMDcyMDEyNy4xLjAuMTczMDcyMDEyNy4wLjAuMTMzNDUwMTA3">
                                Sales Executive - IC & Semiconductor Specialist
                            </Link>
                            <br />
                            <span>Sales - Sales Executive - IC & Semiconductor Specialist - Tampa, FL</span>
                        </li>
                    </ul>
                </section> */}
                <section className={styles.positions}>
                    <div className={styles.header}>
                        <h1>Available Positions:</h1>
                    </div>
                    <div className="teamtailor-jobs-widget" data-teamtailor-limit="20" data-teamtailor-api-key="U8ntkfrr9VcYYqqC69KU1wuoEp6dBCQVYyKsX07R"></div>
                </section>
                
                <footer className={styles.footer}>
                    <p>
                        For more information, please see: <Link href="https://careers.microchipusa.com/">https://careers.microchipusa.com/</Link>.
                    </p>
                </footer>
            </div>
        </>
    );
};
