import React from 'react'
import { RichText } from 'prismic-reactjs'
import { default as NextLink } from 'next/link'
import { linkResolver } from '../prismic-configuration'
import Image from 'next/image'

const FeaturedPost = ({ featuredPost }) => {
    return (
        <div className="card h-100" key={featuredPost.uid}>
            <NextLink
                // href={hrefResolver(featuredPost)}
                as={linkResolver(featuredPost)}
                href={linkResolver(featuredPost)}
                passHref
                shallow={true}>
                <a>
                    <Image
                        src={featuredPost.featuredImage.url}
                        alt={featuredPost.featuredImage.alt}
                        className="card-img-top"
                        layout="intrinsic"
                        preload="true"
                        width={featuredPost.featuredImage.dimensions.width}
                        height={featuredPost.featuredImage.dimensions.height}
                    />
                    <div className="card-body">
                        <h1 className="card-title">{RichText.asText(featuredPost.title)}</h1>
                    </div>
                </a>
            </NextLink>
        </div>
    )
}

export default FeaturedPost
