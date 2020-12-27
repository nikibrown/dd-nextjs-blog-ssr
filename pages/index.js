import React from 'react';
import Prismic from 'prismic-javascript';
import { RichText, Date } from 'prismic-reactjs';
import { client, linkResolver, hrefResolver } from '../prismic-configuration';
import Link from 'next/link';
import Image from 'next/image';
import PostListItem from '../components/PostListItem';
import GatedContentPost from '../components/GatedContentPost';

const BlogHome = ({ home, posts, featuredPosts, gatedContentPosts }) => (
    <div>
        {/* Tutorials: 
		https://vercel.com/guides/deploying-next-and-prismic-with-vercel 
		https://dev.to/ruben_suet/set-up-nextjs-9-4-with-prismic-as-headless-cms-27ij
		<pre>{JSON.stringify({home})}</pre>
		<pre>{JSON.stringify({posts})}</pre> 
		<pre>{JSON.stringify({gatedContentPosts})}</pre> */}
        {/* <img src={home.data.image.url} alt="avatar image" /> */}

        <Image src={home.data.image.url} alt="foo" width={600} height={460} />

        {/* NextJS Image component documentation:
		https://nextjs.org/docs/basic-features/image-optimization 
		
		Prismic/Imgix docs https://user-guides.prismic.io/en/articles/3309829-image-optimization-imgix-integration
		
		*/}

        <h1>{RichText.asText(home.data.headline)}</h1>
        <p>{home.data.test_field}</p>
        <p>{RichText.asText(home.data.description)}</p>
        <h2>Gated Content! Y U Not mapping through data?</h2>
        <p>
            I can access data from the API like so: gatedContentPosts.results[2].data.test :{' '}
            {gatedContentPosts.results[2].data.test}
        </p>
        <p>But for some reason I can't map through gatedContentPosts (UL below)</p>
        <ul>
            {gatedContentPosts.results.map((gatedContentPost) => {
                <li key={gatedContentPost.uid}>
                    <p>{RichText.render(gatedContentPost.data.title)}</p>
                </li>;
            })}
        </ul>
        <h2>Featured Posts</h2>
        <ul>
            {featuredPosts.results.map((featuredPost, index) => (
                <li key={index}>
                    <Link
                        href={hrefResolver(featuredPost)}
                        as={linkResolver(featuredPost)}
                        passHref>
                        <a>{RichText.render(featuredPost.data.title)}</a>
                    </Link>
                    <span>{Date(featuredPost.data.date).toString()}</span>
                </li>
            ))}
        </ul>
        <h2>Blog Posts</h2>
        <ul>
            {posts.results.map((post, index) =>
                // after every three posts insert gated content
                (index + 1) % 3 ? (
                    <PostListItem
                        key={post.uid}
                        post={post}
                        title={post.data.title}
                        date={post.data.date}
                    />
                ) : (
                    <>
                        <PostListItem
                            key={post.uid}
                            post={post}
                            title={post.data.title}
                            date={post.data.date}
                        />
                        <p>Gated content will go here!</p>

                        {/* {gatedContent.results.map((gatedContentPost, index) => {
					{index}
					<GatedContentPost 
						key={gatedContentPost.uid}
						gatedContentPost={gatedContentPost}
						title={gatedContentPost.data.title}
						date={gatedContentPost.data.date}
					/>
				})} */}
                    </>
                )
            )}
        </ul>
    </div>
);

export async function getServerSideProps({ res }) {
    const home = await client.getSingle('blog_home');

    const featuredPosts = await client.query(
        [
            Prismic.Predicates.at('document.type', 'post'),
            Prismic.Predicates.at('document.tags', ['Featured'])
        ],
        { orderings: '[my.post.date desc]' }
    );

    const posts = await client.query(
        [
            Prismic.Predicates.at('document.type', 'post'),
            Prismic.Predicates.not('document.tags', ['Featured'])
        ],
        { orderings: '[my.post.date desc]' }
    );

    const gatedContentPosts = await client.query(
        [Prismic.Predicates.at('document.type', 'gated_content')],
        { orderings: '[my.post.date desc]' }
    );

    // TODO: nav example https://prismic.io/docs/technologies/navbars-footers-and-menus-nextjs

    // TODO: fullText for search https://prismic.io/docs/technologies/query-predicate-reference-javascript#fulltext

    // ✔ insert gated_content something every three posts

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');

    return { props: { home, featuredPosts, posts, gatedContentPosts } };
}

export default BlogHome;
