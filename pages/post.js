import React from 'react'
import { default as NextLink } from 'next/link'
import { RichText, Date } from 'prismic-reactjs'
import { client, relatedLinkResolver, relatedHrefResolver } from '../prismic-configuration'

const Post = ({ post }) => (
    <main>
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

        {/* {RichText.render(post.data.body)} */}

        {/* TODO: logic for slices https://prismic.io/docs/technologies/rendering-slices-reactjs */}

        {/* ✔ TODO: Repeating (maybe a slice) for content relationship https://prismic.io/docs/technologies/rendering-a-link-or-content-relationship-field-reactjs */}

        <h2>You should also read this blog posts:</h2>

        <ul>
            {/* TODO: figure out why refreshing the page results in a 404. 
			
			https://stackoverflow.com/questions/54815348/nextjs-page-goes-to-404-on-refresh
			https://nextjs.org/learn/basics/dynamic-routes
			*/}

            {post.data.related_content.map((relatedPost, index) => (
                <li key={index}>
                    <NextLink
                        // TODO: find a way to use/understand the regular linkResolver & hrefResolver for relatedPosts in ./prismic-configuration.js
                        href={relatedHrefResolver(relatedPost)}
                        as={relatedLinkResolver(relatedPost)}
                        passHref>
                        <a>
                            {RichText.render(relatedPost.blog_post.data.title)}
                            <img
                                src={relatedPost.blog_post.data.featured_image.url}
                                alt={relatedPost.blog_post.data.title}
                                width={600}
                                height={460}
                            />
                        </a>
                    </NextLink>
                </li>
            ))}
        </ul>

        <link
            href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900"
            rel="stylesheet"
        />

        <style global jsx>{`
            body {
                color: #353535;
                font-family: 'Lato', sans-serif;
            }

            main {
                margin: 50px auto;
                width: 50vw;
            }
            .featured-image {
                height: auto;
                max-width: 300px;
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
