import React from 'react'
import Prismic from 'prismic-javascript'
import { RichText, Date } from 'prismic-reactjs'
import { client, linkResolver, hrefResolver } from '../prismic-configuration'
import Link from 'next/link'
import PostListItem from '../components/PostListItem'



const BlogHome = ({ home, posts, featuredPosts, counter }) => (
  <div>
	  {/* <pre>{JSON.stringify({home})}</pre>
	  <pre>{JSON.stringify({posts})}</pre> */}
    <img src={home.data.image.url} alt="avatar image" />
    <h1>{RichText.asText(home.data.headline)}</h1>
	<p>{home.data.test_field}</p>
    <p>{RichText.asText(home.data.description)}</p>

	<h2>Featured Posts</h2>
	<ul>
	{featuredPosts.results.map((featuredPost) => (
        <li key={featuredPost.uid}>
			<Link href={hrefResolver(featuredPost)} as={linkResolver(featuredPost)} passHref>
           		<a>{RichText.render(featuredPost.data.title)}</a>
         	</Link>
         <span>{Date(featuredPost.data.date).toString()}</span>
		</li>
      ))}
	</ul>

	<h2>Blog Posts</h2>
	<ul>
	
      {posts.results.map((post, index) => 

				(index + 1) % 3 ?
				<PostListItem
					key={post.uid}
					post={post}
					title={post.data.title}
					date={post.data.date}
					counter={index+1}
				/>
				:
				<>
					<PostListItem
					key={post.uid}
					post={post}
					title={post.data.title}
					date={post.data.date}
					counter={index+1}
				/>
				<h2>Insert gated content</h2>
				</>
				
			
		// insert gated_content something every three posts
       
      )}
    </ul>
  </div>
)

export async function getServerSideProps({res}) {
let counter = 1;
  const home = await client.getSingle('blog_home')
  const featuredPosts = await client.query([
	Prismic.Predicates.at('document.type', 'post'),
	Prismic.Predicates.at("document.tags", ['Featured'])],
    { orderings: '[my.post.date desc]' }
  )

  const posts = await client.query([
	Prismic.Predicates.at('document.type', 'post'),
	Prismic.Predicates.not("document.tags", ['Featured'])],
    { orderings: '[my.post.date desc]' }
  )

  // use fullText for search https://prismic.io/docs/technologies/query-predicate-reference-javascript#fulltext

  // insert gated_content something every three posts

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return { props: { home, featuredPosts, posts, counter } }
}

export default BlogHome
