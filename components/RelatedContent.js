import React from 'react'
import { RichText } from 'prismic-reactjs'
import { default as NextLink } from 'next/link'
import { relatedLinkResolver, relatedHrefResolver } from '../prismic-configuration'

/**
 * Post slice zone component
 */
const RelatedContent = ({ relatedContent }) => {
    // check to see if related content exists && related content is actually selected - check first item in array and see if a post id is there
    if (relatedContent.length !== 0 && relatedContent[0].blog_post.id !== undefined) {
        return (
            <div>
                <h2>Related Content</h2>
                <ul>
                    {relatedContent.map((relatedPost, index) => (
                        <li key={index}>
                            <NextLink
                                href={relatedHrefResolver(relatedPost)}
                                as={relatedLinkResolver(relatedPost)}
                                passHref>
                                <a>
                                    {RichText.render(relatedPost.blog_post.data.title)}
                                    <img
                                        src={relatedPost.blog_post.data.featured_image.url}
                                        alt={relatedPost.blog_post.data.title}
                                        width={600}
                                        height={460}
                                    />
                                </a>
                            </NextLink>
                        </li>
                    ))}
                </ul>
            </div>
        )
    } else {
        return <h1>No Related Content Items </h1>
    }
}

export default RelatedContent
