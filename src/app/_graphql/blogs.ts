import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, CONTENT_MEDIA, MEDIA_BLOCK } from './blocks'
import { LINK_FIELDS } from './link'
import { MEDIA } from './media'
import { META } from './meta'

export const BLOGS = `
  query Blogs {
    Blogs(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const BLOG = `
  query Blog($slug: String, $draft: Boolean) {
    Blogs(where: { slug: { equals: $slug }}, limit: 1, draft: $draft) {
      docs {
        id
        title
        categories {
          title
        }
        createdAt
        hero {
          type
          richText
          links {
            link ${LINK_FIELDS()}
          }
          ${MEDIA}
        }
        layout {
          ${CONTENT}
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${CONTENT_MEDIA}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        relatedBlogs {
          id
          slug
          title
          ${META}
        }
        ${META}
      }
    }
  }
`
