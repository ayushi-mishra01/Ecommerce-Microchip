'use client';
import React from 'react';
import type { StaticImageData } from 'next/image';
import type { Page } from '../../../payload/payload-types';
import { Gutter } from '../../_components/Gutter';
import { Media } from '../../_components/Media';
import RichText from '../../_components/RichText';
import classes from './index.module.scss';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';


    const CustomPrevArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
            className={classes.prev}
            style={{ ...style, display: 'block', height: '2.5rem', width:'2.5rem' }}
            onClick={onClick}
            >
            <ChevronLeft style={{fontSize:'2.5rem', paddingRight: '10px'}} />
            </div>
        );
    };

    const CustomNextArrow = (props: any) => {
        const { className, style, onClick } = props;
        return (
            <div
            className={classes.next}
            style={{ ...style, display: 'block', height: '2.5rem', width:'2.5rem'  }}
            onClick={onClick}
            >
            <ChevronRight style={{fontSize:'2rem'}}/>
            </div>
        );
    };


type CarouselProps = Extract<Page['layout'][0], { blockType: 'carousel' }> & {
  id?: string;
  cardsPerPage: number;
  slidesToScroll: number;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  loop?: boolean;
  staticImage?: StaticImageData;
  cards: {
    media: string;
    richText: any;
    mediaHeight?: string;
    mediaWidth?: string;
    mediaMargin?:string;
    contentWidth?: string;
    contentHeight?: string;
    contentMargin?: string;
  }[];
};

export const Carousel: React.FC<CarouselProps> = ({
  cardsPerPage,
  slidesToScroll,
  autoPlay = false,
  autoPlaySpeed = 3000,
  loop = true,
  staticImage,
  cards,
}) => {
  const settings = {
    dots: true,
    infinite: loop, 
    speed: 2000,
    slidesToShow: cardsPerPage,
    slidesToScroll: slidesToScroll,
    autoplay: autoPlay,
    autoplaySpeed: autoPlaySpeed,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className={classes.carouselWrapper}>
      <Gutter className={`${classes.carousel} ${classes.noPadding}`} >
        <Slider {...settings} className={classes.slides}>
          {cards.map((card, index) => {
            const {
              media,
              richText,
              mediaHeight,
              mediaWidth,
              mediaMargin,
              contentHeight,
              contentMargin,
            } = card;

            let caption;
            if (media && typeof media === 'object') caption = media.caption;

            return (
              <div
                key={index}
                className={classes.card}
                style={{
                  height: contentHeight || 'auto',
                  margin: contentMargin,
                }}
              >
                <div
                  className={classes.media}
                  style={{
                    marginTop: mediaMargin,
                    width: mediaWidth,
                  }}
                >
                  <Media resource={media} size="(max-width: 768px) 100vw, 30vw" src={staticImage} style={{height: mediaHeight,}} />
                  {caption && <RichText className={classes.caption} content={caption} />}
                </div>
                <div className={classes.content}>
                  <RichText content={richText} />
                </div>
              </div>
            );
          })}
        </Slider>
      </Gutter>
    </div>
  );
};
