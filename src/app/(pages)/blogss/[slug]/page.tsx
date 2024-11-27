import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Blog } from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { RelatedPosts } from '../../../_blocks/RelatedPosts'
import { Blocks } from '../../../_components/Blocks'
import { BlogHero } from '../../../_heros/BlogHero'
import { generateMeta } from '../../../_utilities/generateMeta'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const dynamic = 'force-dynamic'

export default async function Blog({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let blog: Blog | null = null

  try {
    blog = await fetchDoc<Blog>({
      collection: 'blogs',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    console.error(error) 
  }

  if (!blog) {
    notFound()
  }

  const { layout, relatedBlogs } = blog

  return (
    <React.Fragment>
      <div className="content-container">
      <BlogHero blog={blog} />
      <Blocks
        blocks={[
          ...layout,
          {
            blockType: 'relatedPosts',
            blockName: 'Related blogs',
            relationTo: 'blogs',
            introContent: [
              {
                type: 'h4',
                children: [
                  {
                    text: 'Related blogs',
                  },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'The blogs displayed here are individually selected for this page. Admins can select any number of related blogs to display here and the layout will adjust accordingly. Alternatively, you could swap this out for the "Archive" block to automatically populate blogs by category complete with pagination. To manage related blogs, ',
                  },
                  {
                    type: 'link',
                    url: `/admin/collections/blogs/${blog.id}`,
                    children: [
                      {
                        text: 'navigate to the admin dashboard',
                      },
                    ],
                  },
                  {
                    text: '.',
                  },
                ],
              },
            ],
            docs: relatedBlogs,
          },
        ]}
      />
      </div>
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const blogs = await fetchDocs<Blog>('blogs')
    return blogs?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let blog: Blog | null = null

  try {
    blog = await fetchDoc<Blog>({
      collection: 'blogs',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {}

  return generateMeta({ doc: blog })
}