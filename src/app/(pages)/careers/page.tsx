import React from 'react';
import { Metadata } from 'next'
import Careers from './careerComponents';

export default function Account() {
    
    return (
        <>
            <div className="content-container">
                <Careers/>
            </div>    
        </>
    );
};

export const metadata: Metadata = {
    title: 'Microchip USA Careers',
    description: 'Microchip USA Careers Page.'
  }