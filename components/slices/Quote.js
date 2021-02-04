import React from 'react'
import { RichText } from 'prismic-reactjs'
import { linkResolver } from '../../prismic-configuration'

/**
 * Quote slice component
 */
const Quote = ({ slice }) => (
    <div className="post-part single container">
        <blockquote className="block-quotation">{RichText.asText(slice.primary.quote)}</blockquote>
        {/* <style jsx global>
            {quoteStyles}
        </style> */}
    </div>
)

export default Quote
