import React from 'react'
import { RichText, Date } from 'prismic-reactjs'
import { linkResolver, hrefResolver } from '../prismic-configuration'
import { default as NextLink } from 'next/link'
// import { headerStyles } from 'styles'

const PostListItem = ({ post, title, date }) => {
    return (
        // <div className="home">
        //   <div className="blog-avatar"  style={{ backgroundImage: `url(${image.url})` }} />
        //   <h1 className="blog-title">{RichText.asText(headline)}</h1>
        //   <p className="blog-description">{RichText.asText(description)}</p>
        //   <style jsx global>{headerStyles}</style>
        // </div>

        <li>
            <NextLink href={hrefResolver(post)} as={linkResolver(post)} passHref>
                <a>{RichText.asText(title)}</a>
            </NextLink>
            <p>{Date(date).toString()}</p>
        </li>
    )
}

export default PostListItem
