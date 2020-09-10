require('dotenv').config();
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  const pageContext = {
    writekey: `${process.env.COSMIC_WRITE_KEY}`,
    readKey: `${process.env.COSMIC_READ_KEY}`,
    cosmicBucket: `${process.env.COSMIC_BUCKET_SLUG}`,
  }
  if (process.env.NODE_ENV === 'production') {
    pageContext.buildhookUrl = `${process.env.BUILDHOOK_ENDPOINT}`
  }
  deletePage(page)
  createPage({
    ...page,
    context: pageContext,
  })
}


// Gatsby's built in createPages API lets you
//  explicitly create a page route from a template
exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  // configures our route and redirect slug
  createRedirect({
    fromPath: `/doc/*`,
    isPermanent: true,
    redirectInBrowser: true,
    toPath: `/`,
  })

  // This promise makes a graphql request and builds
  //  a page using the returned data and our docTemplate
  return new Promise((resolve, reject) => {
    const docTemplate = path.resolve(`src/templates/docPage.js`)

    resolve(
      graphql(`
        query {
          docs {
            objectsByType(bucket_slug: "${process.env.COSMIC_BUCKET}", type_slug: "docs", read_key: "${process.env.COSMIC_READ_KEY}") {
              title
            }
          }
        }
      `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        result.data.docs.objectsByType.forEach(doc => {
          let slug = doc.title.toLowerCase().replace(/\s/g, '-')
          createPage({
            path: `/doc/${slug}`,
            component: docTemplate,
            context: {
              cosmicBucket: `${process.env.COSMIC_BUCKET}`,
              readKey: `${process.env.COSMIC_READ_KEY}`,
              title: slug,
            }
          })
        })
      })
    )
  })
}

// You can delete this file if you're not using it
