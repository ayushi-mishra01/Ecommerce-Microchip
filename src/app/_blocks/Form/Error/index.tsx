import * as React from 'react'
import classes from './index.module.scss'

export const Error: React.FC = () => {
  const errorStyle = {
    marginTop: '5px',
    color: '#ff0000' 
  };

  return <div style={errorStyle}>This field is required</div>;
}
