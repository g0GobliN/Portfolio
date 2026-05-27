import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDbBlog, type Blog } from "@/lib/firebase";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const blog = await getDbBlog(params.slug);
    if (!blog) throw notFound();
    return { blog };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.blog.title} — Vishal Gurung` },
          { name: "description", content: loaderData.blog.tagline },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="text-display text-6xl text-primary">404</h1>
        <p className="mt-2 text-muted-foreground">Blog post not found.</p>
        <Link to="/blog" className="mt-6 inline-block underline">
          Back to blog
        </Link>
      </div>
    </div>
  ),
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { blog } = Route.useLoaderData() as { blog: Blog };

  // Helper to render markdown paragraphs nicely
  const paragraphs = blog.content.split(/\n\n+/).filter(Boolean);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> back to list
        </Link>

        <article className="mt-10">
          <header className="border-b border-border pb-8">
            <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-primary" /> {blog.publishedAt}
              </span>
            </div>

            <h1 className="text-display text-4xl sm:text-5xl md:text-6xl mt-2 leading-[1.1] text-foreground">
              {blog.title}
            </h1>

            <p className="mt-4 text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              {blog.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {blog.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground flex items-center gap-1"
                >
                  <Tag className="size-2 text-primary" /> {t}
                </span>
              ))}
            </div>
          </header>

          <section className="mt-10 space-y-6 text-muted-foreground leading-relaxed text-base sm:text-lg">
            {paragraphs.map((p, i) => {
              // Simple markdown formatting helper (bold, code blocks, headers)
              if (p.startsWith("# ")) {
                return (
                  <h2 key={i} className="text-display text-2xl text-foreground mt-8 mb-4">
                    {p.replace("# ", "")}
                  </h2>
                );
              }
              if (p.startsWith("## ")) {
                return (
                  <h3 key={i} className="text-display text-xl text-foreground mt-6 mb-3">
                    {p.replace("## ", "")}
                  </h3>
                );
              }
              if (p.startsWith("```")) {
                const code = p.replace(/```[a-z]*\n?/g, "").replace(/```$/g, "");
                return (
                  <pre key={i} className="bg-black/50 border border-border rounded-xl p-4 font-mono text-sm overflow-x-auto text-foreground my-6">
                    <code>{code}</code>
                  </pre>
                );
              }
              return <p key={i}>{p}</p>;
            })}
          </section>
        </article>

        <footer className="mt-16 pt-8 border-t border-border flex justify-between">
          <Link
            to="/blog"
            className="text-sm font-mono text-primary hover:underline"
          >
            ← Back to all posts
          </Link>
          <Link
            to="/"
            className="text-sm font-mono text-muted-foreground hover:underline"
          >
            Go home
          </Link>
        </footer>
      </div>
    </main>
  );
}
