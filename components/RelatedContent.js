import React from 'react'
import { RichText } from 'prismic-reactjs'
import { default as NextLink } from 'next/link'
import { relatedLinkResolver } from '../prismic-configuration'
import Image from 'next/image'

const RelatedContent = ({ relatedContent }) => {
    // check to see if related content exists && related content is actually selected - check first item in array and see if a post id is there
    if (relatedContent.length !== 0 && relatedContent[0].blog_post.id !== undefined) {
        return (
            <div className="col-12">
                <h2>Related Content</h2>
                <div className="row">
                    {relatedContent.map((relatedPost, index) => (
                        <div className="col-lg-4 col-sm-12" key={index}>
                            <div className="card h-100">
                                <NextLink
                                    href={relatedLinkResolver(relatedPost)}
                                    as={relatedLinkResolver(relatedPost)}
                                    passHref>
                                    <a>
                                        <Image
                                            src={relatedPost.blog_post.data.featured_image.url}
                                            alt={relatedPost.blog_post.data.title}
                                            className="card-img-top"
                                            width={
                                                relatedPost.blog_post.data.featured_image.dimensions
                                                    .width
                                            }
                                            height={
                                                relatedPost.blog_post.data.featured_image.dimensions
                                                    .height
                                            }
                                        />
                                        <div className="card-body">
                                            <h1 className="card-title">
                                                {RichText.asText(relatedPost.blog_post.data.title)}
                                            </h1>
                                        </div>
                                    </a>
                                </NextLink>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <div className="col-12">
                <h1>No Related Content Items </h1>
            </div>
        )
    }
}

export default RelatedContent
