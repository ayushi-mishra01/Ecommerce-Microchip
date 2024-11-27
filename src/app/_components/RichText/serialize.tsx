import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'
import { Text } from 'slate'

import { Label } from '../Label'
import { LargeBody } from '../LargeBody'
import { CMSLink } from '../Link'

// eslint-disable-next-line no-use-before-define
type Children = Leaf[]

type Leaf = {
  type: string
  value?: {
    url: string
    alt: string
  }
  children?: Children
  url?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'  // Added textAlign type
  [key: string]: unknown
}

const serialize = (children?: Children): React.ReactNode[] =>
  children?.map((node, i) => {
    if (Text.isText(node)) {
      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />

      if (node.bold) {
        text = <strong key={i}>{text}</strong>
      }

      if (node.code) {
        text = <code key={i}>{text}</code>
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>
      }

      if (node.underline) {
        text = (
          <span style={{ textDecoration: 'underline' }} key={i}>
            {text}
          </span>
        )
      }

      if (node.strikethrough) {
        text = (
          <span style={{ textDecoration: 'line-through' }} key={i}>
            {text}
          </span>
        )
      }

      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    // Ensure textAlign is properly typed
    const textAlignStyle = node.textAlign ? { textAlign: node.textAlign as 'left' | 'center' | 'right' | 'justify' } : {}

    switch (node.type) {
      case 'h1':
        return <h1 key={i} style={textAlignStyle}>{serialize(node?.children)}</h1>
      case 'h2':
        return <h2 key={i} style={textAlignStyle}>{serialize(node?.children)}</h2>
      case 'h3':
        return <h3 key={i} style={textAlignStyle}>{serialize(node?.children)}</h3>
      case 'h4':
        return <h4 key={i} style={textAlignStyle}>{serialize(node?.children)}</h4>
      case 'h5':
        return <h5 key={i} style={textAlignStyle}>{serialize(node?.children)}</h5>
      case 'h6':
        return <h6 key={i} style={textAlignStyle}>{serialize(node?.children)}</h6>
      case 'quote':
        return <blockquote key={i} style={textAlignStyle}>{serialize(node?.children)}</blockquote>
      case 'ul':
        return <ul key={i} style={textAlignStyle}>{serialize(node?.children)}</ul>
      case 'ol':
        return <ol key={i} style={textAlignStyle}>{serialize(node.children)}</ol>
      case 'li':
        return <li key={i} style={textAlignStyle}>{serialize(node.children)}</li>
      case 'link':
        return (
          <CMSLink
            key={i}
            type={node.linkType === 'internal' ? 'reference' : 'custom'}
            url={node.url}
            reference={node.doc as any}
            newTab={Boolean(node?.newTab)}
          >
            {serialize(node?.children)}
          </CMSLink>
        )

      case 'label':
        return <Label key={i} style={textAlignStyle}>{serialize(node?.children)}</Label>

      case 'large-body': {
        return <LargeBody key={i} style={textAlignStyle}>{serialize(node?.children)}</LargeBody>
      }

      case 'upload':
        return (
          // <img
          //   key={i}
          //   src={node.value?.url || ''}
          //   alt={node.value?.alt || ''}
          //   style={{ maxWidth: '100%', marginLeft: '-8%', maxHeight: '60vh', ...textAlignStyle }}
          // />
          <img
            key={i}
            src={node.value?.url || ''}
            alt={node.value?.alt || ''}
            style={{
              maxWidth: '100%',
              display: 'block',
              margin: '0 auto', // Center by default
              maxHeight: '60vh',
              ...(node.textAlign === 'left' && { marginLeft: 0, marginRight: 'auto' }),
              ...(node.textAlign === 'right' && { marginLeft: 'auto', marginRight: 0 }),
              ...(node.textAlign === 'center' && { marginLeft: 'auto', marginRight: 'auto' }),
              ...textAlignStyle,
            }}
          />
        )
      default:
        return <p key={i} style={textAlignStyle}>{serialize(node?.children)}</p>
    }
  }) || []

export default serialize
