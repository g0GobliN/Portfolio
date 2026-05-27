import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { getDbBlogs, type Blog } from "@/lib/firebase";
import { ArrowLeft, ArrowUpRight, Calendar, Tag } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Vishal Gurung · goblin" },
      {
        name: "description",
        content: "Thoughts, tutorials, and post-mortems by Vishal Gurung (goblin).",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const matchRoute = useMatchRoute();
  const isDetail = matchRoute({ to: "/blog/$slug", fuzzy: true });

  if (isDetail) return <Outlet />;

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDbBlogs()
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blogs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> back to home
        </Link>

        <header className="mt-10 border-b border-border pb-10">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary">
            // writings & logs
          </span>
          <h1 className="text-display text-5xl md:text-7xl mt-4">
            THE GOBLIN <span className="text-primary">BLOG</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A messy catalog of technical write-ups, post-mortems of broken servers, 
            and random thoughts on building software solo in Tokyo.
          </p>
        </header>

        {loading ? (
          <div className="mt-20 text-center font-mono text-sm text-muted-foreground animate-pulse">
            ➜ fetching entries from the grid...
          </div>
        ) : blogs.length === 0 ? (
          <div className="mt-20 text-center font-mono text-sm text-muted-foreground">
            ➜ no entries found. check back later.
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                to="/blog/$slug"
                params={{ slug: blog.slug }}
                className="group rounded-2xl border border-border/80 bg-card/30 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-500 hover:shadow-glow cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-primary" /> {blog.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-display text-2xl group-hover:text-primary transition-colors duration-300">
                    {blog.title}
                  </h3>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {blog.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground flex items-center gap-1"
                      >
                        <Tag className="size-2" /> {t}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-mono text-primary group-hover:translate-x-1 transition-transform">
                    Read <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
