import React from 'react'
import { RichText, Date } from 'prismic-reactjs'
import { linkResolver, hrefResolver } from '../prismic-configuration'
import Link from 'next/link'
// import { headerStyles } from 'styles'

/**
 * Homepage header component
 */
const PostListItem = ({ post, title, date, counter }) => {
  return (
    // <div className="home">
    //   <div className="blog-avatar"  style={{ backgroundImage: `url(${image.url})` }} />
    //   <h1 className="blog-title">{RichText.asText(headline)}</h1>
    //   <p className="blog-description">{RichText.asText(description)}</p>
    //   <style jsx global>{headerStyles}</style>
    // </div>

		<li key={post.uid}>
			<Link href={hrefResolver(post)} as={linkResolver(post)} passHref>
				<a>{ counter++} {RichText.asText(title)}</a>
			</Link>
			<span>{Date(date).toString()}</span>
		</li>
  )
}

export default PostListItem
