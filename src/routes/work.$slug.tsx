import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject, projects, type Project } from "@/lib/projects";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.name} — Vishal Gurung` },
          { name: "description", content: loaderData.project.tagline },
          { property: "og:title", content: `${loaderData.project.name} — goblin` },
          { property: "og:description", content: loaderData.project.tagline },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="text-display text-6xl text-primary">404</h1>
        <p className="mt-2 text-muted-foreground">Project not found.</p>
        <Link to="/" className="mt-6 inline-block underline">
          Back home
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="text-display text-3xl">Something broke.</h1>
        <button onClick={reset} className="mt-4 underline">
          Try again
        </button>
      </div>
    </div>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData() as { project: Project };
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-4" /> back to index
        </Link>

        <header className="mt-10 border-b border-border pb-10">
          <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <span className="text-primary">/ {project.year}</span>
            <span>{project.role}</span>
          </div>
          <h1 className="text-display text-6xl md:text-8xl mt-4">
            {project.name.split("").map((c, i) => (
              <span key={i} className={i % 3 === 0 ? "text-primary" : ""}>
                {c}
              </span>
            ))}
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl">
            {project.tagline}
          </p>

          {project.links && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:scale-[1.02] transition"
                >
                  {l.label} <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          )}
        </header>

        <section className="mt-12 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-display text-2xl mb-3">
                <span className="text-primary">01.</span> Overview
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{project.summary}</p>
            </div>

            {project.story && (
              <div>
                <h2 className="text-display text-2xl mb-3">
                  <span className="text-primary">02.</span> The story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {project.story.map((s, i) => (
                    <p key={i}>{s}</p>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-display text-2xl mb-3">
                <span className="text-primary">{project.story ? "03." : "02."}</span> Highlights
              </h2>
              <ul className="space-y-2">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-muted-foreground">
                    <span className="text-primary mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {project.challenges && (
              <div>
                <h2 className="text-display text-2xl mb-3">
                  <span className="text-primary">04.</span> What was actually hard
                </h2>
                <ul className="space-y-2">
                  {project.challenges.map((h) => (
                    <li key={h} className="flex gap-3 text-muted-foreground">
                      <span className="text-primary mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.modules && (
              <div>
                <h2 className="text-display text-2xl mb-3">
                  <span className="text-primary">05.</span> Architecture
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {project.modules.map((m) => (
                    <div key={m.name} className="rounded-xl border border-border bg-card p-4">
                      <div className="font-mono text-sm text-primary">{m.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {m.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-mono px-2 py-1 rounded-md bg-surface-2 border border-border"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Role
              </div>
              <div className="text-sm">{project.role}</div>
              <div className="mt-4 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Year
              </div>
              <div className="text-sm">{project.year}</div>
            </div>
          </aside>
        </section>

        <Link
          to="/work/$slug"
          params={{ slug: next.slug }}
          className="mt-20 group block rounded-2xl border border-border bg-card hover:bg-surface-2 transition p-8"
        >
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Next project →
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-display text-4xl md:text-5xl group-hover:text-primary transition">
              {next.name}
            </div>
            <ArrowUpRight className="size-8 group-hover:rotate-45 transition-transform" />
          </div>
          <p className="mt-2 text-muted-foreground">{next.tagline}</p>
        </Link>
      </div>
    </main>
  );
}
