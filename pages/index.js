import React from 'react'
import Prismic from 'prismic-javascript'
import { RichText, Date } from 'prismic-reactjs'
import { client, linkResolver, hrefResolver } from '../prismic-configuration'
import { default as NextLink } from 'next/link'
import Image from 'next/image'
import PostListItem from '../components/PostListItem'
// import GatedContentPost from '../components/GatedContentPost'

const BlogHome = ({ home, posts, featuredPosts, allBlogContent }) => (
    <main>
        <div className="container">
            {/* Tutorials: 
		https://vercel.com/guides/deploying-next-and-prismic-with-vercel 
		https://dev.to/ruben_suet/set-up-nextjs-9-4-with-prismic-as-headless-cms-27ij
		<pre>{JSON.stringify({home})}</pre>
		// <pre>{JSON.stringify({posts})}</pre> 
        <pre>{JSON.stringify({ gatedContentPosts })}</pre>
        <img src={home.data.image.url} alt="avatar image" /> */}
            {/* <pre>{JSON.stringify({ home })}</pre> */}
            <Image
                src={home.data.image.url}
                alt={home.data.image.alt}
                width={home.data.image.dimensions.width}
                height={home.data.image.dimensions.height}
                className="blog-image"
            />
            {/* NextJS Image component documentation:
		https://nextjs.org/docs/basic-features/image-optimization 
		
		Prismic/Imgix docs https://user-guides.prismic.io/en/articles/3309829-image-optimization-imgix-integration
		
		*/}

            {/* <pre>{JSON.stringify({ home })}</pre> */}

            <h1>{RichText.asText(home.data.headline)}</h1>
            <p>{home.data.test_field}</p>
            <p>{RichText.asText(home.data.description)}</p>
            <h2>Featured Posts</h2>
            <div className="row">
                {featuredPosts.results.map((featuredPost, index) => (
                    <div className="col-lg-4" key={featuredPost.uid}>
                        <NextLink
                            href={hrefResolver(featuredPost)}
                            as={linkResolver(featuredPost)}
                            passHref>
                            <a className="card">
                                <img
                                    className="card-img-top"
                                    src="http://placekitten.com/300/200"
                                    alt="Card image cap"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {RichText.render(featuredPost.data.title)}
                                    </h5>
                                    <h6 classNAme="card-subtitle mb-2 text-muted">
                                        {Date(featuredPost.data.date).toString()}
                                    </h6>
                                </div>
                            </a>
                        </NextLink>
                    </div>
                ))}
            </div>
            <h2>Blog Posts</h2>

            <ol>
                {allBlogContent.map((post) => (
                    <li key={post.uid}>
                        <NextLink href={hrefResolver(post)} as={linkResolver(post)} passHref>
                            <a>
                                <Image
                                    src={post.featuredImage.url}
                                    alt={post.featuredImage.alt}
                                    className="featured-image"
                                    width={post.featuredImage.dimensions.width}
                                    height={post.featuredImage.dimensions.height}
                                />
                            </a>
                        </NextLink>
                        <NextLink href={hrefResolver(post)} as={linkResolver(post)} passHref>
                            <a>{RichText.render(post.title)}</a>
                        </NextLink>
                    </li>
                ))}
            </ol>

            {/* TODO: delete this shit and use amys shit https://codepen.io/nikibrown/pen/LYRQPgX https://codesandbox.io/s/youthful-voice-4p2i8?file=/src/Posts.js:1629-1647 */}

            {/* <ol>
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

                       

                        {index + 1 === 3 ? (
                            <h3>
                                Gated Content Post 1
                                {home.data.promoted_gated_content[0].gated_content.slug}
                            </h3>
                        ) : null}

                        {index + 1 === 6 ? (
                            <h3>
                                Gated Content Post 2
                                {home.data.promoted_gated_content[1].gated_content.slug}
                            </h3>
                        ) : null}

                        {index + 1 === 9 ? (
                            <h3>
                                Gated Content Post 3
                                {home.data.promoted_gated_content[2].gated_content.slug}
                            </h3>
                        ) : null}
                    </>
                )
            )}
        </ol> */}

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
                body {
                    color: #353535;
                    font-family: 'Lato', sans-serif;
                }

                .featured-image {
                    height: auto;
                    max-width: 300px;
                }

                .blog-image {
                    display: block;
                    margin: 20px auto;
                }
            `}</style>
        </div>
    </main>
)

export async function getServerSideProps({ res }) {
    const home = await client.getSingle('blog_home', {
        fetchLinks: ['gated_content.uid', 'gated_content.title', 'gated_content.featured_image']
    })

    const featuredPosts = await client.query(
        [
            Prismic.Predicates.at('document.type', 'post'),
            Prismic.Predicates.at('document.tags', ['Featured'])
        ],
        { orderings: '[my.post.date desc]' }
    )

    const posts = await client.query(
        [
            Prismic.Predicates.at('document.type', 'post'),
            Prismic.Predicates.not('document.tags', ['Featured'])
        ],
        { orderings: '[my.post.date desc]' }
    )

    // const gatedContentPosts = await client.query(
    //     Prismic.Predicates.at('document.type', 'gated_content'),
    //     { orderings: '[my.post.date desc]' }
    // )

    // cleaning up and combining blog post and gated content data

    let allBlogContent = []
    let aggregatedPosts = []
    let aggregatedGatedContent = []

    posts.results.forEach((post) => {
        let uid = post.uid
        let title = post.data.title
        let featuredImage = post.data.featured_image
        let type = 'blog_post'
        let postObj = {}

        postObj.type = type
        postObj.uid = uid
        postObj.title = title
        postObj.featuredImage = featuredImage
        aggregatedPosts.push(postObj)
    })

    // ✔ TODO: instead of looping through the datedContentPosts query get the relationship data from the home singleton content type

    const promotedGatedContent = []

    home.data.promoted_gated_content.forEach((promotedGatedContentPost) => {
        let uid = promotedGatedContentPost.gated_content.uid
        let title = promotedGatedContentPost.gated_content.data.title
        let featuredImage = promotedGatedContentPost.gated_content.data.featured_image
        let type = 'gated_content'
        let gatedObj = {}

        gatedObj.type = type
        gatedObj.uid = uid
        gatedObj.title = title
        gatedObj.featuredImage = featuredImage
        promotedGatedContent.push(gatedObj)
    })

    // gatedContentPosts.results.forEach((gatedContentPost) => {
    //     let uid = gatedContentPost.uid
    //     let title = gatedContentPost.data.title
    //     let type = 'gated_content'

    //     let gatedObj = {}
    //     gatedObj.type = type
    //     gatedObj.uid = uid
    //     gatedObj.title = title
    //     aggregatedGatedContent.push(gatedObj)
    // })

    let gatedContentCount = 0

    // aggregatedPosts.forEach((post, key) => {
    //     if (key > 0 && key % 3 === 0) {
    //         if (gatedContentCount < aggregatedGatedContent.length) {
    //             const gatedPost = aggregatedGatedContent[gatedContentCount]
    //             gatedContentCount++
    //             allBlogContent.push(gatedPost)
    //         }
    //     }
    //     allBlogContent.push(post)
    // })

    aggregatedPosts.forEach((post, key) => {
        if (key > 0 && key % 3 === 0) {
            if (gatedContentCount < promotedGatedContent.length) {
                const gatedPost = promotedGatedContent[gatedContentCount]
                gatedContentCount++
                allBlogContent.push(gatedPost)
            }
        }
        allBlogContent.push(post)
    })

    // TODO: nav example https://prismic.io/docs/technologies/navbars-footers-and-menus-nextjs

    // TODO: fullText for search https://prismic.io/docs/technologies/query-predicate-reference-javascript#fulltext

    // ✔ insert gated_content something every three posts

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

    return { props: { home, featuredPosts, posts, allBlogContent } }
}

export default BlogHome
