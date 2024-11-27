import React from 'react'
import { StaticImageData } from 'next/image'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'mediaBlock' }> & {
  staticImage?: StaticImageData
  id?: string
  mediaHeight?: string
  mediaWidth?: string
  mediaMarginTop?: string
  mediaMarginRight?: string
  mediaMarginBottom?: string
  mediaMarginLeft?: string
}

export const MediaBlock: React.FC<Props> = props => {
  const { 
    media, 
    position = 'default', 
    staticImage, 
    mediaHeight, 
    mediaWidth, 
    mediaMarginTop, 
    mediaMarginRight, 
    mediaMarginBottom, 
    mediaMarginLeft 
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  const mediaStyles = {
    height: mediaHeight,
    width: mediaWidth,
    marginTop: mediaMarginTop,
    marginRight: mediaMarginRight,
    marginBottom: mediaMarginBottom,
    marginLeft: mediaMarginLeft,
  }

  return (
    <div className={classes.mediaBlock}>
      {position === 'fullscreen' && (
        <div className={classes.fullscreen}>
          <Media resource={media} src={staticImage} style={mediaStyles} />
        </div>
      )}
      {position === 'default' && (
        <Gutter>
          <Media resource={media} src={staticImage} style={mediaStyles} />
        </Gutter>
      )}
      {caption && (
        <Gutter className={classes.caption}>
          <RichText content={caption} />
        </Gutter>
      )}
    </div>
  )
}
