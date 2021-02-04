import React from 'react'
import { default as NextLink } from 'next/link'
import { RichText, Date } from 'prismic-reactjs'
import { client, relatedLinkResolver, relatedHrefResolver } from '../prismic-configuration'

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
    const gatedContent = await client.getByUID('gated_content', query.uid, {
        fetchLinks: ['post.title', 'post.featured_image']
    })

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return { props: { gatedContent } }
}

export default GatedContent
