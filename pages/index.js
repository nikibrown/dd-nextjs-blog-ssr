import React from 'react'
import Prismic from 'prismic-javascript'
import { RichText, Date } from 'prismic-reactjs'
import { client, linkResolver, hrefResolver } from '../prismic-configuration'
import { default as NextLink } from 'next/link'
import Image from 'next/image'
import FeaturedPost from '../components/FeaturedPost'
import BlogPost from '../components/BlogPost'

const BlogHome = ({ home, allFeaturedPosts, allBlogContent }) => (
    <main>
        <div className="container">
            {/* IGNORE FOR TROUBLESHOOTING! <p>{JSON.stringify({ allBlogContent })}</p> 
			<h1>featuredPosts (data from prismic)</h1>
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
                <h1>{RichText.asText(home.data.headline)}!!!!!</h1>
                <p className="lead">{RichText.asText(home.data.description)}</p>
            </div>
        </div>

        <section className="featured-posts jumbotron">
            <div className="container">
                <h2 className="mb-4">Featured Posts</h2>
                <div className="row">
                    {allFeaturedPosts.map((featuredPost, index) => (
                        <div className="col-lg-4 col-sm-12" key={index}>
                            <FeaturedPost featuredPost={featuredPost} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="blog-posts">
            <div className="container">
                <h2 className="mb-4">Blog Posts</h2>

                <div className="row">
                    {allBlogContent.map((post, index) => (
                        <div
                            className={`${
                                post.gated ? 'col-lg-8 col-sm-12' : 'col-lg-4 col-sm-12'
                            }  mb-4`}
                            key={index}>
                            <BlogPost postData={post} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </main>
)

export async function getServerSideProps({ res }) {
    // Get homepage content (including gated posts), featured post content and post content
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

    // cleaning up data from prismic
    let allBlogContent = []
    let aggregatedPosts = []
    let allFeaturedPosts = []
    let promotedGatedContent = []

    // make obj for posts
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

    // make obj for featuredPosts
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

    // make obj for gatedContent
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

    // insert gatedContent into allBlogContent
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

    // Not sure I need this anymore 🔽
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

    return { props: { home, allFeaturedPosts, allBlogContent } }
}

export default BlogHome
