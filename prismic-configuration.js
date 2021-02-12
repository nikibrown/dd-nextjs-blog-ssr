import Prismic from 'prismic-javascript'

// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = 'https://dd-sample-next-js-blog.cdn.prismic.io/api/v2'

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
export const accessToken = ''

// Routing in nextjs https://prismic.io/blog/seo-with-react-and-nextjs

// i18n example https://user-guides.prismic.io/en/articles/2933718-multi-language-website-with-prismic-and-next-js-10

// -- Link resolution rules
// Manages links to internal Prismic documents
// Modify as your project grows to handle any new routes you've made
export const linkResolver = (doc) => {
    if (doc.type === 'blog_post') {
        return `/blog/${doc.uid}`
    } else if (doc.type === 'gated_content') {
        return `/gated-content/${doc.uid}`
    }

    return '/'
}

// Additional helper function for Next/Link components
export const hrefResolver = (doc) => {
    if (doc.type === 'blog_post') {
        return `/post?uid=${doc.uid}`
    } else if (doc.type === 'gated_content') {
        // /gated-content here refers to ./pages/gated-content.js and this passes the uid to the template. I think this also makes the association between content type and template for rendering.
        return `/gated-content?uid=${doc.uid}`
    }
    return '/'
}

// Wondering if I need to have post.js and gated-content.js inside /pages/blog/post.js & pages/gated-content/gated-content.js

// Also wondering how this is all working without using next.js router?

// TODO: combine these helper functions - find a way to check if a post has related content
// <Link> nextjs component docs https://nextjs.org/docs/api-reference/next/link

// since relatedPosts have a slightly different data structure we need modified resolvers

export const relatedLinkResolver = (relatedPost) => {
    return `/blog/${relatedPost.blog_post.uid}`
}

export const relatedHrefResolver = (relatedPost) => {
    return `/post?uid=${relatedPost.blog_post.uid}`
}

// -- Client method to query Prismic
// Connects to the given repository to facilitate data queries
export const client = Prismic.client(apiEndpoint, { accessToken })
