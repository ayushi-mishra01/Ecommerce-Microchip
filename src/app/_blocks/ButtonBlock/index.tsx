"use client";

import React from 'react';
import classes from './index.module.scss';
import type { Page } from '../../../payload/payload-types';

type ButtonBlockProps = Extract<Page['layout'][0], { blockType: 'buttonBlock' }> & {
  id?: string;
  buttonLabel: string;
  buttonHeight?: string;
  buttonWidth?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  buttonMarginTop?: string;
  buttonMarginRight?: string;
  buttonMarginBottom?: string;
  buttonMarginLeft?: string;
  buttonPadding?: string;
  borderRadius?: string;
  fontSize?: string;
  buttonLink: string;
  openInNewTab?: boolean;
};

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  buttonLabel,
  buttonHeight,
  buttonWidth,
  buttonBackgroundColor,
  buttonTextColor,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  buttonMarginTop,
  buttonMarginRight,
  buttonMarginBottom,
  buttonMarginLeft,
  buttonPadding,
  borderRadius,
  fontSize,
  buttonLink,
  openInNewTab = false,
}) => {
  const buttonStyle = {
    height: buttonHeight || 'auto',
    width: buttonWidth || 'auto',
    backgroundColor: buttonBackgroundColor || '#000',
    color: buttonTextColor || '#fff',
    borderTop: borderTop || 'none',
    borderRight: borderRight || 'none',
    borderBottom: borderBottom || 'none',
    borderLeft: borderLeft || 'none',
    marginTop: buttonMarginTop || '0',
    marginRight: buttonMarginRight || '0',
    marginBottom: buttonMarginBottom || '0',
    marginLeft: buttonMarginLeft || '0',
    padding: buttonPadding || '10px 20px',
    textDecoration: 'none',
    borderRadius: borderRadius || 'none',
    fontSize: fontSize || 'inherit',
    cursor: 'pointer',
  };

  const handleClick = () => {
    if(openInNewTab){
      window.open(buttonLink, '_blank'); 
      return;
    }
    window.location.href = buttonLink; 
  };

  return (
    <button
      className={classes.button}
      style={buttonStyle}
      onClick={handleClick}
    >
      {buttonLabel}
    </button>
  );
};