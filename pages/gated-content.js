import React from 'react'
import { default as NextLink } from 'next/link'
import { RichText, Date } from 'prismic-reactjs'
import { client, relatedLinkResolver, relatedHrefResolver } from '../prismic-configuration'

const GatedContent = ({ gatedContent }) => (
    <div>
        <NextLink href="/">
            <a>Back to blog list</a>
        </NextLink>
        <pre>{JSON.stringify({ gatedContent })}</pre>

        {RichText.render(gatedContent.data.title)}
        {RichText.render(gatedContent.data.content)}
        {gatedContent.data.test}
    </div>
)

export async function getServerSideProps({ query, res }) {
    const gatedContent = await client.getByUID('gated_content', query.uid, {
        fetchLinks: ['post.title', 'post.featured_image']
    })

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return { props: { gatedContent } }
}

export default GatedContent
