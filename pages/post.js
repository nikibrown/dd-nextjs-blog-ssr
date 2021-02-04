import React from 'react'
import { default as NextLink } from 'next/link'
import { RichText, Date } from 'prismic-reactjs'
import SliceZone from '../components/SliceZone'
import RelatedContent from '../components/RelatedContent'
import { client, relatedLinkResolver, relatedHrefResolver } from '../prismic-configuration'

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

            article {
                padding: 100px 0;
            }
        `}</style>
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
