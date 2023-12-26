import React from "react";
import { Helmet } from "react-helmet";
import { siteMetadata } from "../site_metadata";

export interface SEOProps {
  title: string;
  description?: string;
}

function SEO({ title, description }: SEOProps) {
  const metaDescription = description || siteMetadata.description;

  return (
    // @ts-ignore
    <Helmet
      htmlAttributes={{
        lang: "en",
      }}
      title={title}
      titleTemplate={`%s`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]}
    ></Helmet>
  );
}

export default SEO;
