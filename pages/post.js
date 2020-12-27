import React from 'react';
import Link from 'next/link';
import { RichText, Date } from 'prismic-reactjs';
import { client, relatedLinkResolver, relatedHrefResolver } from '../prismic-configuration';

const Post = ({ post }) => (
    <div>
        <Link href="/">
            <a>Back to blog list</a>
        </Link>

        {/* <pre>{JSON.stringify({ post })}</pre> */}

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
            {post.data.related_content.map((relatedPost, index) => (
                <li key={index}>
                    <Link
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
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export async function getServerSideProps({ query, res }) {
    const post = await client.getByUID('post', query.uid, {
        fetchLinks: ['post.title', 'post.featured_image']
    });

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    return { props: { post } };
}

export default Post;
