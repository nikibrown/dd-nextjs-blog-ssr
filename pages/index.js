import React from 'react'
import Prismic from 'prismic-javascript'
import { RichText, Date } from 'prismic-reactjs'
import { client, linkResolver, hrefResolver } from '../prismic-configuration'
import { default as NextLink } from 'next/link'
import Image from 'next/image'
import PostListItem from '../components/PostListItem'
// import GatedContentPost from '../components/GatedContentPost'

const BlogHome = ({ home, posts, featuredPosts, allBlogContent }) => (
    <div>
        {/* Tutorials: 
		https://vercel.com/guides/deploying-next-and-prismic-with-vercel 
		https://dev.to/ruben_suet/set-up-nextjs-9-4-with-prismic-as-headless-cms-27ij
		<pre>{JSON.stringify({home})}</pre>
		// <pre>{JSON.stringify({posts})}</pre> 
        <pre>{JSON.stringify({ gatedContentPosts })}</pre>
        <img src={home.data.image.url} alt="avatar image" /> */}
        {/* <pre>{JSON.stringify({ home })}</pre> */}
        <Image src={home.data.image.url} alt="foo" width={600} height={460} />
        {/* NextJS Image component documentation:
		https://nextjs.org/docs/basic-features/image-optimization 
		
		Prismic/Imgix docs https://user-guides.prismic.io/en/articles/3309829-image-optimization-imgix-integration
		
		*/}

        <pre>{JSON.stringify({ home })}</pre>

        <h1>{RichText.asText(home.data.headline)}</h1>
        <p>{home.data.test_field}</p>
        <p>{RichText.asText(home.data.description)}</p>
        <h2>Featured Posts</h2>
        <ul>
            {featuredPosts.results.map((featuredPost, index) => (
                <li key={featuredPost.uid}>
                    <NextLink
                        href={hrefResolver(featuredPost)}
                        as={linkResolver(featuredPost)}
                        passHref>
                        <a>{RichText.render(featuredPost.data.title)}</a>
                    </NextLink>
                    <span>{Date(featuredPost.data.date).toString()}</span>
                </li>
            ))}
        </ul>
        <h2>Blog Posts</h2>

        <ol>
            {allBlogContent.map((post) => (
                <li key={post.uid}>
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
    </div>
)

export async function getServerSideProps({ res }) {
    const home = await client.getSingle('blog_home', {
        fetchLinks: ['gated_content.uid', 'gated_content.title']
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
        let type = 'blog_post'
        let postObj = {}

        postObj.type = type
        postObj.uid = uid
        postObj.title = title
        aggregatedPosts.push(postObj)
    })

    // TODO: instead of looping through the datedContentPosts query get the relationship data from the home singleton content type

    const promotedGatedContent = []

    home.data.promoted_gated_content.forEach((promotedGatedContentPost) => {
        let uid = promotedGatedContentPost.gated_content.uid
        let title = promotedGatedContentPost.gated_content.data.title
        let type = 'gated_content'

        let gatedObj = {}
        gatedObj.type = type
        gatedObj.uid = uid
        gatedObj.title = title
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
