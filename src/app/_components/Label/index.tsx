import React from 'react';
import classes from './index.module.scss';

interface LabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties; 
}

export const Label: React.FC<LabelProps> = ({ children, style }) => {
  return <p className={classes.label} style={style}>{children}</p>;
};
