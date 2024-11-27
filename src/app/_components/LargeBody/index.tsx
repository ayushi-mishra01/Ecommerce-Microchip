import React from 'react';
import classes from './index.module.scss';

interface LargeBodyProps {
  children: React.ReactNode;
  style?: React.CSSProperties; 
}

export const LargeBody: React.FC<LargeBodyProps> = ({ children, style }) => {
  return <p className={classes.largeBody} style={style}>{children}</p>;
};
