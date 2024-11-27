import React from 'react';
import { Page } from '../../../payload/payload-types';
import { Gutter } from '../../_components/Gutter';
import { CMSLink } from '../../_components/Link';
import RichText from '../../_components/RichText';
import { ContentMedia } from '../ContentMedia';
import classes from './index.module.scss';
import type { StaticImageData } from 'next/image';
import { FormBlock } from '../Form';
import { Carousel } from '../Carousel';
import { ButtonBlock } from '../ButtonBlock';

type BlockItem =
  | {
      blockType: 'contentMedia';
      media: string;
      richText: any;
      staticImage?: StaticImageData;
      mediaHeight?: string;
      mediaWidth?: string;
      mediaMarginTop?: string;
      mediaMarginRight?: string;
      mediaMarginBottom?: string;
      mediaMarginLeft?: string;
      contentWidth?: string;
      contentHeight?: string;
      mediaPosition?: 'left' | 'right';
    }
  | {
      blockType: 'formBlock';
      form: any;
      enableIntro?: boolean;
      introContent?: any;
    }
  | {
      blockType: 'carousel';
      cardsPerPage?: number;
      slidesToScroll?: number;
      autoPlay?: boolean;
      autoPlaySpeed?: number;
      loop?: boolean;
      staticImage?: StaticImageData;
      cards?: {
        media: string ; 
        richText: any;
        mediaHeight?: string;
        mediaWidth?: string;
        mediaMargin?: string;
        contentWidth?: string;
        contentHeight?: string;
        contentMargin?: string;
      }[];
    }
    | {
      blockType: 'buttonBlock';
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

type ContentColumn = {
  invertBackground: boolean;
  size: 'oneThird' | 'half' | 'twoThirds' | 'full';
  richText: any;
  enableLink: boolean;
  link: any;
  contentMedia?: BlockItem[];
  columnWidth?: string;
  columnHeight?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  padding?: string;
  marginLeft?: string;
}

type Props = Extract<Page['layout'][0], { blockType: 'content' }> & {
  id?: string;
  contentHeight?: string;
  contentWidth?: string;
  contentPaddingTop?: string;
  contentMarginBottom?: string;
  columns?: ContentColumn[]; 
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
}

export const ContentBlock: React.FC<Props> = props => {
  const { columns, contentHeight, contentWidth, contentPaddingTop, contentMarginBottom,
    backgroundColor, color, fontSize } = props;

  return (
    <Gutter>
    {/* <Gutter className={`${classes.content} ${classes.noPadding}`}> */}
     {/* <Gutter className={`${classes.content}`}> */}
      <div
        className={`${classes.grid} ${classes.noPadding}`}
        style={{
          height: contentHeight,
          width: contentWidth ,
          paddingTop: contentPaddingTop || 'none',
          marginBottom: contentMarginBottom || 'none',
          backgroundColor: backgroundColor,
          color: color,
          fontSize: fontSize || 'none',
        }}
      >
        {columns &&
          columns.length > 0 &&
          columns.map((col: ContentColumn, index: number) => {
            const { invertBackground, enableLink, richText, link, size, contentMedia,columnWidth, 
            columnHeight, borderTop, borderRight, borderBottom, borderLeft, padding, marginLeft
             } = col;

            return (
              <div
                key={index}
                className={[classes.column, classes[`column--${size}`]].join(' ')}
                style={{ backgroundColor: invertBackground ? '#f7f7f8' : 'initial',
                  width: columnWidth ,
                  height: columnHeight ,
                  borderTop: borderTop || 'none',
                  borderRight: borderRight || 'none',
                  borderBottom: borderBottom || 'none',
                  borderLeft: borderLeft || 'none',
                  padding: padding || 'none',
                  marginLeft: marginLeft || 'none',
                 }}
              >
                <RichText content={richText} />
                {enableLink && <CMSLink className={classes.link} {...link} />}

                {/* Render contentMedia or formBlock or carousel*/}
                {contentMedia && (
                  <div className={classes.contentMedia}>
                    {contentMedia.map((mediaItem, mediaIndex) => {
                      if (mediaItem.blockType === 'contentMedia') {
                        return <ContentMedia key={mediaIndex} {...mediaItem} />;
                      } else if (mediaItem.blockType === 'formBlock') {
                        return (
                          <FormBlock
                            key={mediaIndex}
                            form={mediaItem.form}
                            enableIntro={mediaItem.enableIntro}
                            introContent={mediaItem.introContent}
                          />
                        );
                      } else if (mediaItem.blockType === 'carousel') {
                        //console.log('Media Item: 2', mediaItem);
                        // console.log(mediaItem.cards); 
                        return (
                          <Carousel
                            key={mediaIndex}
                            blockType="carousel"
                            cardsPerPage={mediaItem.cardsPerPage || 1}
                            slidesToScroll={mediaItem.slidesToScroll || 1}
                            autoPlay={mediaItem.autoPlay || false}
                            autoPlaySpeed={mediaItem.autoPlaySpeed || 3000}
                            loop={mediaItem.loop || true}
                            staticImage={mediaItem.staticImage}
                            cards={mediaItem.cards || []}
                          />
                        );
                      }else if (mediaItem.blockType === 'buttonBlock') {
                        return (
                          <ButtonBlock
                            key={mediaIndex}
                            blockType="buttonBlock"
                            buttonLabel={mediaItem.buttonLabel}  
                            buttonHeight={mediaItem.buttonHeight}
                            buttonWidth={mediaItem.buttonWidth}
                            buttonBackgroundColor={mediaItem.buttonBackgroundColor}
                            buttonTextColor={mediaItem.buttonTextColor}
                            borderTop={mediaItem.borderTop}
                            borderRight={mediaItem.borderRight}
                            borderBottom={mediaItem.borderBottom}
                            borderLeft={mediaItem.borderLeft}
                            buttonMarginTop={mediaItem.buttonMarginTop}
                            buttonMarginRight={mediaItem.buttonMarginRight}
                            buttonMarginBottom={mediaItem.buttonMarginBottom}
                            buttonMarginLeft={mediaItem.buttonMarginLeft}
                            buttonPadding={mediaItem.buttonPadding}
                            borderRadius={mediaItem.borderRadius}
                            fontSize = {mediaItem.fontSize}
                            buttonLink={mediaItem.buttonLink}
                            openInNewTab={mediaItem.openInNewTab}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </Gutter>
  );
}
