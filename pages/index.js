import React from 'react'
import Prismic from 'prismic-javascript'
import { RichText, Date } from 'prismic-reactjs'
import { client, linkResolver, hrefResolver } from '../prismic-configuration'
import Link from 'next/link'

const BlogHome = ({ home, posts, counter }) => (
  <div>
	  {/* <pre>{JSON.stringify({home})}</pre>
	  <pre>{JSON.stringify({posts})}</pre> */}
    <img src={home.data.image.url} alt="avatar image" />
    <h1>{RichText.asText(home.data.headline)}</h1>
	<p>{home.data.test_field}</p>
    <p>{RichText.asText(home.data.description)}</p>
	<ul>
	
      {posts.results.map((post) => (
        <li key={post.uid}>
			<Link href={hrefResolver(post)} as={linkResolver(post)} passHref>
           		<a>{ counter++} {RichText.render(post.data.title)}</a>
         	</Link>
         <span>{Date(post.data.date).toString()}</span>

			
		</li>
      ))}
    </ul>
  </div>
)

export async function getServerSideProps({res}) {
let counter = 1;
  const home = await client.getSingle('blog_home')
  const posts = await client.query(
    Prismic.Predicates.at('document.type', 'post'),
    { orderings: '[my.post.date desc]' }
  )

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  return { props: { home, posts, counter } }
}

export default BlogHome
