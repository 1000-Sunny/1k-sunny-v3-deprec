import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout pageContext={{ title: 'not found' }}>
    <SEO title="404: Not found" />
    <h1>NOT FOUND ):</h1>
    <p>Che tristezza, hai preso una strada che non porta da nessuna parte.</p>
  </Layout>
)

export default NotFoundPage
