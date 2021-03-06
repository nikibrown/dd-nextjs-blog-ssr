import React from 'react'
import { RichText } from 'prismic-reactjs'
import { default as NextLink } from 'next/link'
import { linkResolver } from '../prismic-configuration'
import Image from 'next/image'

const BlogPost = ({ postData }) => {
    return (
        <div className={`card h-100  ${postData.type}`} key={postData.uid}>
            <NextLink
                href={linkResolver(postData)}
                as={linkResolver(postData)}
                passHref
                shallow={true}>
                <a>
                    <Image
                        src={postData.featuredImage.url}
                        alt={postData.featuredImage.alt}
                        className="card-img-top"
                        layout="responsive"
                        width={postData.featuredImage.dimensions.width}
                        height={postData.featuredImage.dimensions.height}
                    />
                    <div className="card-body">
                        <h1 className="card-title">{RichText.asText(postData.title)}</h1>
                    </div>
                </a>
            </NextLink>
        </div>
    )
}

export default BlogPost
