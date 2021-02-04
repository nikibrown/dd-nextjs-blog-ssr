import React from 'react'
import { default as NextLink } from 'next/link'
import { RichText, Date } from 'prismic-reactjs'
import SliceZone from '../components/SliceZone'
import RelatedContent from '../components/RelatedContent'
import { client, relatedLinkResolver, relatedHrefResolver } from '../prismic-configuration'

const Post = ({ post }) => (
    <main>
        <div className="container">
            <NextLink href="/">
                <a>Back to blog list</a>
            </NextLink>

            {/* <p>{JSON.stringify({ post })}</p> */}

            {RichText.render(post.data.title)}
            <p>{Date(post.data.date).toString()}</p>
            <img
                src={post.data.featured_image.url}
                alt={RichText.render(post.data.title)}
                width="500px"
            />

            <SliceZone sliceZone={post.data.body} />

            {/* TODO: logic for slices https://prismic.io/docs/technologies/rendering-slices-reactjs */}

            {/* ✔ TODO: Repeating (maybe a slice) for content relationship https://prismic.io/docs/technologies/rendering-a-link-or-content-relationship-field-reactjs */}

            {/* https://stackoverflow.com/questions/54815348/nextjs-page-goes-to-404-on-refresh
			https://nextjs.org/learn/basics/dynamic-routes */}

            <RelatedContent relatedContent={post.data.related_content} />

            <link
                rel="stylesheet"
                href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
                integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
                crossOrigin="anonymous"></link>

            <link
                href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900"
                rel="stylesheet"
            />

            <style global jsx>{`
                body,
                html {
                    color: #353535;
                    font-family: 'Lato', sans-serif !important;
                }

                h1,
                h2,
                h3,
                h4 {
                    font-family: 'Lato', sans-serif !important;
                    font-weight: 900;
                }

                .featured-image {
                    height: auto;
                    max-width: 300px;
                }
            `}</style>
        </div>
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
