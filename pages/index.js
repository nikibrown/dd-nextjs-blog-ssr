import React from 'react'
import Prismic from 'prismic-javascript'
import { RichText, Date } from 'prismic-reactjs'
import { client, linkResolver, hrefResolver } from '../prismic-configuration'
import { default as NextLink } from 'next/link'
import Image from 'next/image'
// import PostListItem from '../components/PostListItem'
// import GatedContentPost from '../components/GatedContentPost'

const BlogHome = ({ home, allFeaturedPosts, allBlogContent }) => (
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
            {/* NextJS Image component documentation:
		https://nextjs.org/docs/basic-features/image-optimization 
		
		Prismic/Imgix docs https://user-guides.prismic.io/en/articles/3309829-image-optimization-imgix-integration
		
		*/}
            {/* <p>{JSON.stringify({ allBlogContent })}</p> */}

            {/* <h1>featuredPosts (data from prismic)</h1>
            <p>{JSON.stringify({ featuredPosts })}</p>
            <h1>allFeaturedPosts (simplified data)</h1>
            <p>{JSON.stringify({ allFeaturedPosts })}</p> */}
            <div className="jumbotron bg-white text-center">
                <Image
                    src={home.data.image.url}
                    alt={home.data.image.alt}
                    width={home.data.image.dimensions.width}
                    height={home.data.image.dimensions.height}
                    className="blog-image "
                />
                <h1>{RichText.asText(home.data.headline)}</h1>
                <p className="lead">{RichText.asText(home.data.description)}</p>
            </div>
        </div>

        <section className="featured-posts jumbotron">
            <div className="container">
                <h2 className="mb-4">Featured Posts</h2>
                <div className="row">
                    {allFeaturedPosts.map((featuredPost, index) => (
                        <div className="col-lg-4 col-sm-12">
                            <div className="card h-100" key={featuredPost.uid}>
                                <NextLink
                                    href={hrefResolver(featuredPost)}
                                    // Optional decorator for the path that will be shown in the browser URL bar
                                    as={linkResolver(featuredPost)}
                                    passHref
                                    shallow={true}>
                                    <a>
                                        <Image
                                            src={featuredPost.featuredImage.url}
                                            alt={featuredPost.featuredImage.alt}
                                            className="card-img-top"
                                            width={featuredPost.featuredImage.dimensions.width}
                                            height={featuredPost.featuredImage.dimensions.height}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {RichText.render(featuredPost.title)}
                                            </h5>
                                        </div>
                                    </a>
                                </NextLink>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="blog-posts">
            <div className="container">
                <h2 className="mb-4">Blog Posts</h2>

                <div className="row">
                    {allBlogContent.map((post) => (
                        <div
                            className={`${
                                post.gated ? 'col-lg-8 col-sm-12' : 'col-lg-4 col-sm-12'
                            }  mb-4`}>
                            <div className={`card h-100  ${post.type}`} key={post.uid}>
                                <NextLink
                                    href={hrefResolver(post)}
                                    as={linkResolver(post)}
                                    shallow={true}
                                    passHref>
                                    <a>
                                        <Image
                                            src={post.featuredImage.url}
                                            alt={post.featuredImage.alt}
                                            className="card-img-top"
                                            width={post.featuredImage.dimensions.width}
                                            height={post.featuredImage.dimensions.height}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {RichText.render(post.title)}
                                            </h5>
                                        </div>
                                    </a>
                                </NextLink>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* TODO: delete this shit and use amys shit https://codepen.io/nikibrown/pen/LYRQPgX https://codesandbox.io/s/youthful-voice-4p2i8?file=/src/Posts.js:1629-1647 */}

        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"></link>

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

            .card.gated_content {
                background-color: var(--primary);
                color: var(--light);
            }

            .card.gated_content a {
                color: var(--light);
            }

            .height-0 {
                height: 0;
            }
        `}</style>
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

    // cleaning up and combining blog post and gated content data

    let allBlogContent = []
    let aggregatedPosts = []
    let allFeaturedPosts = []
    let aggregatedGatedContent = []

    posts.results.forEach((post) => {
        let uid = post.uid
        let title = post.data.title
        let body = post.data.body
        let featuredImage = post.data.featured_image
        let type = 'blog_post'
        let gated = false
        let postObj = {}

        postObj.type = type
        postObj.uid = uid
        postObj.body = body
        postObj.title = title
        postObj.featuredImage = featuredImage
        postObj.gated = gated
        aggregatedPosts.push(postObj)
    })

    featuredPosts.results.forEach((post) => {
        let uid = post.uid
        let title = post.data.title
        let body = post.data.body
        let featuredImage = post.data.featured_image
        let type = 'blog_post'
        let gated = false
        let postObj = {}

        postObj.type = type
        postObj.uid = uid
        postObj.title = title
        postObj.body = body
        postObj.featuredImage = featuredImage
        postObj.gated = gated
        allFeaturedPosts.push(postObj)
    })

    // ✔ TODO: instead of looping through the datedContentPosts query get the relationship data from the home singleton content type

    const promotedGatedContent = []

    home.data.promoted_gated_content.forEach((promotedGatedContentPost) => {
        let uid = promotedGatedContentPost.gated_content.uid
        let title = promotedGatedContentPost.gated_content.data.title
        let featuredImage = promotedGatedContentPost.gated_content.data.featured_image
        let type = 'gated_content'
        let gated = true
        let gatedObj = {}

        gatedObj.type = type
        gatedObj.uid = uid
        gatedObj.title = title
        gatedObj.featuredImage = featuredImage
        gatedObj.gated = gated
        promotedGatedContent.push(gatedObj)
    })

    let gatedContentCount = 0

    aggregatedPosts.forEach((post, key) => {
        if (key > 0 && key % 4 === 0) {
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

    return { props: { home, allFeaturedPosts, allBlogContent } }
}

export default BlogHome
