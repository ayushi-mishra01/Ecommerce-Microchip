import React from 'react';
import type { StaticImageData } from 'next/image';
import type { Page } from '../../../payload/payload-types';
import { Gutter } from '../../_components/Gutter';
import { Media } from '../../_components/Media';
import RichText from '../../_components/RichText';
import classes from './index.module.scss';

type ContentMediaProps = Extract<Page['layout'][0], { blockType: 'contentMedia' }> & {
  id?: string;
  staticImage?: StaticImageData;
  mediaHeight?: string;
  mediaWidth?: string;
  mediaMarginTop?: string;
  mediaMarginRight?: string;
  mediaMarginBottom?: string;
  mediaMarginLeft?: string;
  contentWidth?: string;
  contentHeight?: string;
  contentMarginTop?: string;
  contentMarginRight?: string;
  contentMarginBottom?: string;
  contentMarginLeft?: string;
  contentPadding?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
};

export const ContentMedia: React.FC<ContentMediaProps> = (props) => {
  const {
    media,
    mediaPosition = 'left',
    richText,
    staticImage,
    mediaHeight,
    mediaWidth,
    mediaMarginTop,
    mediaMarginRight,
    mediaMarginBottom,
    mediaMarginLeft,
    contentWidth,
    contentHeight,
    contentMarginTop,
    contentMarginRight,
    contentMarginBottom,
    contentMarginLeft,
    contentPadding,
    backgroundColor,
    color,
    fontSize,
  } = props;

  let caption;
  if (media && typeof media === 'object') caption = media.caption;

  return (
    <div style={{ marginLeft: '-8%'}}>
      <Gutter className={`${classes.noPadding}`}>
      <div
          className={`${classes.contentMediaBlock} ${mediaPosition === 'left' ? classes.invert : ''} ${classes[`pos-${mediaPosition}`]}`}
        >
          <div
            className={classes.content}
            style={{
              width: contentWidth,
              height: contentHeight,
              marginTop: contentMarginTop || 'none',
              marginRight: contentMarginRight || 'none',
              marginBottom: contentMarginBottom || 'none',
              marginLeft: contentMarginLeft || 'none',
              padding: contentPadding || 'none',
              backgroundColor: backgroundColor,
              color: color,
              fontSize: fontSize || 'none',
            }}
          >
            <RichText content={richText} />
          </div>
          <div
            className={classes.media}
            style={{
              marginTop: mediaMarginTop || 'none',
              marginRight: mediaMarginRight || 'none',
              marginBottom: mediaMarginBottom || 'none',
              marginLeft: mediaMarginLeft || 'none',
              width: mediaWidth,
            }}
          >
            <Media resource={media} size="(max-width: 768px) 100vw, 30vw" src={staticImage} style={{ height: mediaHeight }} />
            {caption && <RichText className={classes.caption} content={caption} />}
          </div>
        </div>
      </Gutter>
    </div>
  );
};
