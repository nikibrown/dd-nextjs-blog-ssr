import React from 'react'
import { RichText, Date } from 'prismic-reactjs'
import { linkResolver, hrefResolver } from '../prismic-configuration'
import Link from 'next/link'


const GatedContentPost = ({ gatedContent, title, date }) => {
  return (
    // <div className="home">
    //   <div className="blog-avatar"  style={{ backgroundImage: `url(${image.url})` }} />
    //   <h1 className="blog-title">{RichText.asText(headline)}</h1>
    //   <p className="blog-description">{RichText.asText(description)}</p>
    //   <style jsx global>{headerStyles}</style>
    // </div>

	<li>
		<h2>Gated content!</h2>
		<Link href={hrefResolver(gatedContent)} as={linkResolver(gatedContent)} passHref>
			<a><strong>{RichText.asText(title)}</strong></a>
		</Link>
		<span>{Date(date).toString()}</span>
	</li>
  )
}

export default GatedContentPost
