import React from 'react'
import { RichText } from 'prismic-reactjs'
import { linkResolver } from '../../prismic-configuration'

/**
 * Image caption slice component
 */
const ImageCaption = ({ slice }) => {
    const imageComponent =
        slice.slice_label === 'image-full-width' ? (
            <FullWidthImage slice={slice} />
        ) : (
            <DefaultImage slice={slice} />
        )

    return (
        <Fragment>
            {imageComponent}
            {/* <style jsx global>{imageCaptionStyles}</style> */}
        </Fragment>
    )
}

export default ImageCaption
