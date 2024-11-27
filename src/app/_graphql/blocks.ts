import { CATEGORIES } from './categories'
import { LINK_FIELDS } from './link'
import { MEDIA } from './media'
import { META } from './meta'

export const CALL_TO_ACTION = `
...on Cta {
  blockType
  invertBackground
  richText
  links {
    link ${LINK_FIELDS()}
  }
}
`

export const MEDIA_BLOCK = `
...on MediaBlock {
  blockType
  invertBackground
  position
  mediaHeight, 
  mediaWidth, 
  mediaMarginTop, 
  mediaMarginRight, 
  mediaMarginBottom, 
  mediaMarginLeft 
  ${MEDIA}
}
`

export const CONTENT_MEDIA = `
...on ContentMedia {
  blockType
  invertBackground
  richText
  mediaPosition
  mediaHeight
  mediaWidth
  mediaMarginTop
  mediaMarginRight
  mediaMarginBottom
  mediaMarginLeft
  contentWidth
  contentHeight
  contentMarginTop,
  contentMarginRight,
  contentMarginBottom,
  contentMarginLeft,
  contentPadding,
  backgroundColor,
  color,
  fontSize,
  ${MEDIA}
}
`

export const FORM_BLOCK = `
...on FormBlock {
          blockType
          blockName
          enableIntro
          introContent
          form {
            id
            title
            fields{
              __typename
              ... on Text { 
                id
                blockName 
                blockType 
                label 
                name 
                required 
                width 
                defaultValue 
              }
              ... on Checkbox { 
                id
                blockName 
                blockType 
                label 
                name 
                required 
                width 
              }
              ... on Textarea { 
                id
                blockName 
                blockType 
                label 
                name 
                required 
                width 
                defaultValue 
              }
              ... on Select { 
                id
                blockName 
                blockType 
                label 
                name 
                required 
                width 
                options { label value }
                defaultValue 
              }
              ... on Email { 
                id
                blockName 
                blockType 
                label 
                name 
                required 
                width 
              }
              ... on State { 
                id
                blockName 
                blockType 
                label 
                name 
                required 
                width 
              }
              ... on Country { 
                id
                blockName 
                blockType 
                label 
                name 
                required 
                width 
              }
              ... on Message { 
                id
                blockName 
                blockType 
                message 
              }
            }
            submitButtonLabel
  					confirmationType
            redirect {
              url
            }
            confirmationMessage
            emails{
              emailTo
              cc
              bcc
              replyTo
              emailFrom
              subject
              id
            }
          }
        }
 `
 export const CAROUSEL = `
 ...on Carousel{
   invertBackground
   blockType
   cardsPerPage
   slidesToScroll
   autoPlay
   autoPlaySpeed
   loop
   cards{
     richText
     mediaHeight
     mediaWidth
     mediaMargin
     contentHeight
     contentWidth
     contentMargin
     ${MEDIA}
   }
 }
`

export const BUTTON_BLOCK = `
  ...on ButtonBlock {
    id
    blockType
    buttonLabel
    buttonHeight
    buttonWidth
    buttonBackgroundColor
    buttonTextColor
    borderTop
    borderRight
    borderBottom
    borderLeft
    buttonMarginTop
    buttonMarginRight
    buttonMarginBottom
    buttonMarginLeft
    buttonPadding
    borderRadius
    fontSize
    buttonLink
    openInNewTab
  }
`


export const CONTENT = `
...on Content {
  blockType
  invertBackground
  columns {
    invertBackground
    size
    richText
    enableLink
    link ${LINK_FIELDS()} 
    contentMedia {
      ${CONTENT_MEDIA}
      ${FORM_BLOCK}
      ${CAROUSEL}
      ${BUTTON_BLOCK}
    }
    columnWidth
    columnHeight
    borderTop 
    borderRight
    borderBottom
    borderLeft 
    padding
    marginLeft
  }
  contentHeight
  contentWidth
  contentPaddingTop
  contentMarginBottom
  backgroundColor
  color
  fontSize
}
`

export const ARCHIVE_BLOCK = `
...on Archive {
  blockType
  introContent
  populateBy
  relationTo
  ${CATEGORIES}
  limit
  selectedDocs {
    relationTo
    value {
      ...on Post {
        id
        slug
        title
        ${META}
      }
      ...on Project {
        id
        slug
        title
        ${META}
      }
    }
  }
  populatedDocs {
    relationTo
    value {
      ...on Post {
        id
        slug
        title
        ${CATEGORIES}
        ${META}
      }
      ...on Project {
        id
        slug
        title
        ${CATEGORIES}
        ${META}
      }
    }
  }
  populatedDocsTotal
}
`

