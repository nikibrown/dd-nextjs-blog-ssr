import Prismic from 'prismic-javascript';

// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = 'https://dd-sample-next-js-blog.cdn.prismic.io/api/v2';

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
export const accessToken = '';

// -- Link resolution rules
// Manages links to internal Prismic documents
// Modify as your project grows to handle any new routes you've made
export const linkResolver = (doc) => {
    if (doc.type === 'post') {
        return `/blog/${doc.uid}`;
    }
    return '/';
};

// Additional helper function for Next/Link components
export const hrefResolver = (doc) => {
    if (doc.type === 'post') {
        return `/post?uid=${doc.uid}`;
    }
    return '/';
};

// TODO: combine these helper functions - find a way to check if a post has related content
// <Link> nextjs component docs https://nextjs.org/docs/api-reference/next/link

// since relatedPosts have a slightly different data structure we need modified resolvers

export const relatedLinkResolver = (relatedPost) => {
    return `/blog/${relatedPost.blog_post.uid}`;
};

export const relatedHrefResolver = (relatedPost) => {
    return `/post?uid=${relatedPost.blog_post.uid}`;
};

// -- Client method to query Prismic
// Connects to the given repository to facilitate data queries
export const client = Prismic.client(apiEndpoint, { accessToken });
