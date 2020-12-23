import React from 'react'
import Link from 'next/link'
import { RichText, Date } from 'prismic-reactjs'
import { client, linkResolver, hrefResolver } from '../prismic-configuration'

const Post = ({ post }) => (
  <div>
    <Link href="/">
      <a>Back to blog list</a>
    </Link>

	{/* <pre>{JSON.stringify({post})}</pre> */}
    <h1>{RichText.render(post.data.title)}</h1>
	<p>{Date(post.data.date).toString()}</p>
	<img src={post.data.featured_image.url} alt={RichText.render(post.data.title)}  width="500px"/>
    
    {RichText.render(post.data.post_body)}

	{/* TODO: logic for slices https://prismic.io/docs/technologies/rendering-slices-reactjs */}

	{/* TODO: Repeating (maybe a slice) for content relationship https://prismic.io/docs/technologies/rendering-a-link-or-content-relationship-field-reactjs */}


	<h2>You should also read this blog post:</h2>
	<Link href={hrefResolver(post.data.suggested_posts)} as={linkResolver(post.data.suggested_posts)} passHref>
        <a>
		{RichText.render(post.data.suggested_posts.data.title)}
		<img width="200px" src={post.data.suggested_posts.data.featured_image.url} alt={RichText.render(post.data.suggested_posts.data.title)} />
		</a>
    </Link>

	


  </div>
)

export async function getServerSideProps({ query, res }) {
  const post = await client.getByUID('post', query.uid, {'fetchLinks': [  'post.title', 'post.featured_image' ]})

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  return { props: { post } }
}

export default Post