import React from 'react'
import { default as NextLink } from 'next/link'
import { RichText, Date } from 'prismic-reactjs'
import SliceZone from '../../components/SliceZone'
import RelatedContent from '../../components/RelatedContent'
import { client, relatedLinkResolver, relatedHrefResolver } from '../../prismic-configuration'

const Post = ({ post }) => (
    <main>
        <section className="jumbotron text-center">
            <div className="container">
                <h1>{RichText.asText(post.data.title)}</h1>
                <p>{Date(post.data.date).toString()}</p>

                <NextLink href="/">
                    <a>Back to blog list</a>
                </NextLink>
            </div>
        </section>

        <article>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <SliceZone sliceZone={post.data.body} />
                    </div>
                </div>
            </div>
        </article>

        <section className="jumbotron related-posts">
            <div className="container">
                <div className="row">
                    <RelatedContent relatedContent={post.data.related_content} />
                </div>
            </div>
        </section>

        {/* <p>{JSON.stringify({ post })}</p> */}

        {/* https://stackoverflow.com/questions/54815348/nextjs-page-goes-to-404-on-refresh
			https://nextjs.org/learn/basics/dynamic-routes */}
    </main>
)

export async function getServerSideProps({ query, res }) {
    const post = await client.getByUID('post', query.uid, {
        fetchLinks: ['post.title', 'post.featured_image']
    })

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return { props: { post } }
}

export default Post
