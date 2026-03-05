import { Metadata } from "next";
import { Navbar } from "@/components/blocks/Navbar";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { fetchAPI } from "@/lib/api";
import { StrapiResponse, StrapiArticle } from "@/types/strapi";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const response = await fetchAPI<StrapiResponse<StrapiArticle[]>>(
    "/articles",
    {
      "filters[slug][$eq]": slug,
      populate: "*",
    },
  );
  return response?.data?.[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const seo = article.seo;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/articles/${slug}`;

  return {
    title: seo?.metaTitle || article.title,
    description: seo?.metaDescription || article.description,
    keywords: seo?.keywords
      ? seo.keywords.split(",").map((k) => k.trim())
      : undefined,
    robots: seo?.metaRobots || "index, follow",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: seo?.metaTitle || article.title,
      description: seo?.metaDescription || article.description,
      url: url,
      type: "article",
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.metaTitle || article.title,
      description: seo?.metaDescription || article.description,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />
      {article.seo?.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(article.seo.structuredData),
          }}
        />
      )}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-12">
          <p className="font-mono text-xs text-muted mb-4 uppercase tracking-widest">
            <time
              dateTime={new Date(article.publishedAt).toISOString()}
              itemProp="datePublished"
            >
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            itemProp="headline"
          >
            {article.title}
          </h1>
          {article.description && (
            <p
              className="text-xl text-muted leading-relaxed"
              itemProp="description"
            >
              {article.description}
            </p>
          )}
        </header>

        <article
          itemScope
          itemType="https://schema.org/Article"
          className="prose prose-lg dark:prose-invert max-w-none pb-20 border-b border-border"
        >
          <BlocksRenderer content={article.content} />
        </article>

        {article.seo && (
          <section className="mt-12 p-8 border border-border rounded-xl bg-surface/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-mono uppercase tracking-widest text-fg">
                AI SEO Analytics
              </h2>
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
              {article.seo.metaTitle && (
                <div>
                  <dt className="text-muted font-mono text-xs uppercase mb-1">
                    Meta Title
                  </dt>
                  <dd>{article.seo.metaTitle}</dd>
                </div>
              )}
              {article.seo.metaDescription && (
                <div className="md:col-span-2">
                  <dt className="text-muted font-mono text-xs uppercase mb-1">
                    Meta Description
                  </dt>
                  <dd>{article.seo.metaDescription}</dd>
                </div>
              )}
              {article.seo.keywords && (
                <div>
                  <dt className="text-muted font-mono text-xs uppercase mb-1">
                    Keywords
                  </dt>
                  <dd>{article.seo.keywords}</dd>
                </div>
              )}
              {article.seo.metaRobots && (
                <div>
                  <dt className="text-muted font-mono text-xs uppercase mb-1">
                    Robots
                  </dt>
                  <dd className="font-mono">{article.seo.metaRobots}</dd>
                </div>
              )}
            </dl>
          </section>
        )}
      </main>
    </>
  );
}
