# Code for Prismic+Next+Now Serverless guide

Follow along with the instructions in the Zeit guide to build a minimalist blog using Prismic as a CMS with Next.js deployed in Now as a serverless app.

### Install instructions

Use the Prismic CLI to copy the code and create the associated Prismic repository

```bash
yarn global add prismic-cli
prismic theme https://github.com/raulg/prismic-next-blog
```

### Finished example

If after following the guide all the way to the end you want to compare your project to a finished version, check out the `finished` branch for the completed code.

### TODO

-   ✔ instead of looping through the datedContentPosts query get the relationship data from the home singleton content type
-   Pagination
-   Search (tags? keywords? keytext?)
-   Add styling
-   Add featured image for all post types featured_image and bring in with fetchlinks
    -   Blog post
    -   Gated Content
-   Clean up commented code
-   Fix link resolver for regular blog posts
-   Add head component and add global stylesheet
