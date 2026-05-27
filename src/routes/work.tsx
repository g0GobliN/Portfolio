import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { getDbProjects } from "@/lib/firebase";
import { type Project } from "@/lib/projects";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Vishal Gurung · goblin" },
      {
        name: "description",
        content: "Selected projects by Vishal Gurung (goblin) — IT engineer in Japan.",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const matchRoute = useMatchRoute();
  const isDetail = matchRoute({ to: "/work/$slug", fuzzy: true });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDbProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (isDetail) return <Outlet />;

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
            // what i ship
          </span>
          <h1 className="text-display text-5xl md:text-7xl mt-4">
            SELECTED <span className="text-primary">WORK</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Projects built solo or close to it — camera systems, developer tools, and a few weird
            little experiments that probably shouldn't exist but do anyway.
          </p>
        </header>

        {loading ? (
          <div className="mt-20 text-center font-mono text-sm text-muted-foreground animate-pulse">
            ➜ loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-20 text-center font-mono text-sm text-muted-foreground">
            ➜ no projects found. check back later.
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                to="/work/$slug"
                params={{ slug: project.slug }}
                className="group rounded-2xl border border-border/80 bg-card/30 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 transition-all duration-500 hover:shadow-glow cursor-pointer"
              >
                {project.coverImage && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-border/60 h-40 bg-black/30">
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                    <span className="text-primary">{project.year}</span>
                    <span>{project.role}</span>
                  </div>

                  <h3 className="text-display text-2xl group-hover:text-primary transition-colors duration-300">
                    {project.name}
                  </h3>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-mono text-primary group-hover:translate-x-1 transition-transform shrink-0">
                    View <ArrowUpRight className="size-3.5" />
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
