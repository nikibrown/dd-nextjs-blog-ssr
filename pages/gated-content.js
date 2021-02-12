import React from 'react'
import { default as NextLink } from 'next/link'
import { RichText } from 'prismic-reactjs'
import { client, relatedLinkResolver, relatedHrefResolver } from '../prismic-configuration'
import RelatedContent from '../components/RelatedContent'

const GatedContent = ({ gatedContent }) => (
    <main>
        <section className="jumbotron text-center">
            <div className="container">
                <h1>{RichText.asText(gatedContent.data.title)}</h1>
                <NextLink href="/">
                    <a>Back to blog list</a>
                </NextLink>
            </div>
        </section>

        <article>
            <div className="container">
                <div className="row">
                    <div className="col-12">{RichText.render(gatedContent.data.content)}</div>
                </div>
            </div>
        </article>
    </main>
)

export async function getServerSideProps({ query, res }) {
    const gatedContent = await client.getByUID('gated_content', query.uid, {
        fetchLinks: ['post.title', 'post.featured_image']
    })

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return { props: { gatedContent } }
}

export default GatedContent
