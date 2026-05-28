import { createFileRoute, Link } from "@tanstack/react-router";
import { getDbBlogs, getDoodles, type Blog, type Doodle } from "@/lib/firebase";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Instagram,
  Mail,
  Sparkles,
  X,
  Pencil,
} from "lucide-react";
import avatar from "@/img/IMG_4029.jpg";

import { Navbar, MobileNav } from "@/components/Navbar";
import { DoodleModal, DoodleLightbox, DoodleCard } from "@/components/DoodleComponents";
import { DrawCanvas } from "@/components/DrawCanvas";
import { Pill, Stat, SkillBlock } from "@/components/SharedComponents";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vishal Gurung — goblin · IT Engineer in Japan" },
      {
        name: "description",
        content:
          "Portfolio of Vishal Gurung (goblin) — solo IT engineer in Japan. Creator of reality-map, builder of Autcaster, lover of open source and weird little dev tools.",
      },
      { property: "og:title", content: "Vishal Gurung — goblin" },
      {
        property: "og:description",
        content:
          "IT engineer in Japan. Creator of reality-map. システム開発, cameras, WebRTC, and the occasional goblin joke.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [blogsList, setBlogsList] = useState<Blog[]>([]);
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [doodleOpen, setDoodleOpen] = useState(false);
  const [selectedDoodle, setSelectedDoodle] = useState<Doodle | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getDbBlogs().then(setBlogsList);
    getDoodles().then(setDoodles);
  }, []);

  // Pick 9 random doodles once the list loads
  const wallDoodles = useMemo(() => {
    if (doodles.length === 0) return [];
    const limit = typeof window !== "undefined" && window.innerWidth < 640 ? 10 : 9;
    return [...doodles].sort(() => Math.random() - 0.5).slice(0, limit);
  }, [doodles]);

  useEffect(() => {
    if (!doodleOpen) return;
    const y = window.scrollY;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      // Restore position so closing the modal doesn't jump to top
      requestAnimationFrame(() => window.scrollTo(0, y));
    };
  }, [doodleOpen]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ── Floating Navbar ──────────────────────────────────────────── */}
      <Navbar />
      <MobileNav />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative min-h-[100svh] overflow-hidden grid-bg"
      >
        {/* bottom vignette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-6 pt-28 pb-16 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Open to interesting things
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95] mb-6"
          >
            Building things that{" "}
            <em className="not-italic text-primary neon-text">actually</em>{" "}
            <span className="text-accent neon-cyan">work.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-10"
          >
            I'm <span className="text-foreground font-medium">goblin</span> — a
            slightly nocturnal IT engineer based in Tokyo doing{" "}
            <span className="font-mono text-primary">システム開発</span>. Camera
            systems, WebRTC, open source, and the occasional weird experiment
            that probably shouldn't exist.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/work"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground neon-ring rounded-full px-6 py-3 text-sm font-medium hover:scale-[1.03] transition-transform"
            >
              See my work <ArrowRight className="size-4" />
            </Link>
            <a
              href="#doodles"
              className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 text-sm font-medium hover:text-primary transition-colors"
            >
              Draw something
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            scroll
          </motion.p>
        </div>
      </section>

      {/* ── Marquee strip ────────────────────────────────────────────── */}
      <div className="border-y border-border py-4 overflow-hidden bg-surface/30">
        <div className="flex gap-10 text-2xl md:text-3xl font-semibold whitespace-nowrap animate-[scroll_30s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10 shrink-0">
              <span>システム開発</span>
              <span className="text-primary">·</span>
              <span>WEBRTC</span>
              <span className="text-primary">·</span>
              <span>OPEN SOURCE</span>
              <span className="text-primary">·</span>
              <span>FFMPEG</span>
              <span className="text-primary">·</span>
              <span>SOLO BUILDER</span>
              <span className="text-primary">·</span>
              <span>TOKYO</span>
              <span className="text-primary">·</span>
              <span>GOBLIN MODE</span>
              <span className="text-primary">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Doodles / Guestbook ──────────────────────────────────────── */}
      <section
        id="doodles"
        className="py-32 px-6 border-t border-white/5"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-primary neon-text">
              03 — Sketchbook
            </span>
            <h2 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight">
              Leave a doodle.{" "}
              <span className="text-muted-foreground">Be weird.</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
              Things I scribbled at midnight. Scroll through mine, then draw
              yours — no judgment, no rules.
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-[1.2fr_1fr] gap-6">
            {/* Left — draw canvas */}
            <div className="glass rounded-3xl p-4 sm:p-6 mb-6 lg:mb-0">
              <DrawCanvas />
            </div>

            {/* Right — doodle wall */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Doodle wall</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {doodles.length}
                </span>
              </div>

              {doodles.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm font-mono animate-pulse">
                  ➜ loading doodles...
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-mono text-muted-foreground/50 mb-3">
                    click any to open full screen
                  </p>
                  <div className="columns-2 sm:columns-3 gap-3 [column-fill:balance]">
                    {wallDoodles.map((d, i) => {
                      const ROTS = [-6, -3, 2, 5, -4, 3, -2, 6, -5, 1];
                      const rot = ROTS[i % ROTS.length];
                      return (
                        <motion.button
                          key={d.id}
                          style={{ rotate: rot }}
                          whileHover={{ rotate: 0, scale: 1.06, zIndex: 5 }}
                          onClick={() => setSelectedDoodle(d)}
                          className="mb-3 break-inside-avoid w-full text-left cursor-pointer focus:outline-none"
                        >
                          <DoodleCard doodle={d} />
                        </motion.button>
                      );
                    })}
                  </div>
                  {doodles.length > 9 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setDoodleOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition cursor-pointer"
                      >
                        See all {doodles.length} sketches{" "}
                        <ArrowUpRight className="size-3" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <DoodleModal
          open={doodleOpen}
          onClose={() => setDoodleOpen(false)}
          doodles={doodles}
          onSelect={(d) => { setSelectedDoodle(d); }}
        />
        <DoodleLightbox
          doodle={selectedDoodle}
          onClose={() => setSelectedDoodle(null)}
        />
      </section>

      {/* ── Blog ─────────────────────────────────────────────────────── */}
      {blogsList.length > 0 && (
        <section id="writing" className="px-6 py-20 border-t border-white/5">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-primary neon-text">
                  04 — Field notes
                </span>
                <h2 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight">
                  Latest writings
                </h2>
              </div>
              <Link
                to="/blog"
                className="hidden md:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition"
              >
                View all <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {blogsList.slice(0, 3).map((blog) => (
                <Link
                  key={blog.slug}
                  to="/blog/$slug"
                  params={{ slug: blog.slug }}
                  className="group glass rounded-2xl p-6 flex flex-col gap-4 overflow-hidden relative hover:border-primary/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span className="text-primary">{blog.publishedAt}</span>
                    {blog.tags?.[0] && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8">
                        {blog.tags[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {blog.tagline}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-primary group-hover:translate-x-1 transition-transform">
                    Read entry <ArrowUpRight className="size-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl grid md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-2">
            <span className="text-xs uppercase tracking-[0.3em] text-primary neon-text">
              05 — About
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              From a shy Nepali kid to{" "}
              <span className="text-primary neon-text">Tokyo engineer.</span>
            </h2>
            <div
              className="mt-6 glass rounded-2xl overflow-hidden border border-white/10 group h-[340px]"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              <img
                src={avatar}
                alt="Vishal Gurung"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700 ease-out"
                style={{ objectPosition: "center bottom" }}
              />
            </div>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              No perfect plan. No genius story. Just curiosity that never really
              stopped.
            </p>
          </div>
          <div className="md:col-span-3 space-y-5 text-muted-foreground text-lg leading-relaxed">
            <p>
              I'm <span className="text-foreground font-medium">goblin</span>{" "}
              — real name Vishal, quiet kid from Nepal. My parents handed me a
              phone, a PC, and a stack of video games so I'd stay busy. Funny
              enough, that small decision probably changed my whole life.
            </p>
            <p>
              Somewhere along the way I watched one of those movies with a
              hacker in it. Green text, terminals, chaos — the usual. Something
              about it stuck hard. Not the movie version of hacking, but the
              feeling of understanding things nobody explained to you.
            </p>
            <p>
              While still in school I randomly started learning Japanese — no
              master plan, just a hunch. Japan answered before I even finished
              choosing a college back home.
            </p>
            <p>
              So suddenly it was me in Tokyo — futon on the floor, conbini
              coffee beside me, writing{" "}
              <span className="font-mono text-primary">システム開発</span> every
              day while trying to build a life out of code and stubbornness.
            </p>
            <p>
              These days it's camera systems, WebRTC pipelines, FFmpeg
              problems, payment flows, dashboards, Docker containers, and
              debugging things that worked perfectly ten minutes ago. I still
              love it though.
            </p>
            <p>
              On the side I release open-source like{" "}
              <a
                href="https://www.npmjs.com/package/reality-map"
                target="_blank"
                rel="noreferrer"
                className="text-foreground hover:text-primary transition"
              >
                reality-map
              </a>{" "}
              — tools I genuinely wished existed when I was younger.
            </p>
            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Stat k="Based in" v="Japan 🇯🇵" />
              <Stat k="Role" v="IT Engineer" />
              <Stat k="Languages" v="EN · JP · NE · HI" />
              <Stat k="Mode" v="Solo builder" />
            </div>
          </div>
        </div>

      </section>

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <section id="skills" className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-primary neon-text">
              06 — Stack
            </span>
            <h2 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight">
              Tools of the trade
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
              My day job is camera-heavy, so the stack leans toward streaming,
              on-prem agents and dashboards. But I'm at home pretty much
              anywhere on the JS/TS spectrum.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <SkillBlock
              title="Frontend"
              items={["React", "Vite", "TypeScript", "Tailwind", "Next-ish things"]}
            />
            <SkillBlock
              title="Backend"
              items={["Node.js", "Express", "REST APIs", "Firebase Admin", "Stripe"]}
            />
            <SkillBlock
              title="Media & Cameras"
              items={["WebRTC", "MediaMTX", "FFmpeg", "RTSP / HLS", "On-prem agents"]}
            />
            <SkillBlock
              title="Infra-ish"
              items={[
                "Linux servers",
                "Docker basics",
                "Cloud functions",
                "Webhooks",
                "QR / device flows",
              ]}
            />
            <SkillBlock
              title="Open Source"
              items={[
                "TypeScript libs",
                "AST tooling",
                "CLI design",
                "npm publishing",
                "Issues triage",
              ]}
            />
            <SkillBlock
              title="Soft stuff"
              items={[
                "Solo shipping",
                "Owning the full stack",
                "Talking to non-tech clients",
                "EN / JP / NE / HI",
                "Patience with cameras",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <section id="contact" className="px-6 py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary neon-text">
            07 — Contact
          </span>
          <h2 className="mt-4 text-5xl md:text-8xl font-semibold tracking-tight leading-[0.95]">
            Let's{" "}
            <span className="text-primary neon-text">build</span>{" "}
            something.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Got a weird idea, an open-source itch, a camera that won't behave,
            or a system that needs to actually ship? I'm one email away. Bonus
            points if it involves{" "}
            <span className="font-mono text-primary">システム開発</span>.
          </p>
          <a
            href="mailto:grgvishal.gurung17@gmail.com"
            className="mt-10 inline-flex items-center gap-3 px-6 py-4 rounded-full bg-primary text-primary-foreground font-medium neon-ring hover:scale-[1.02] transition"
          >
            <Mail className="size-4" />
            grgvishal.gurung17@gmail.com
          </a>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Pill href="https://github.com/g0GobliN" icon={<Github className="size-3.5" />}>
              g0GobliN
            </Pill>
            <Pill href="https://instagram.com/goblin01_" icon={<Instagram className="size-3.5" />}>
              goblin01_
            </Pill>
            <Pill
              href="https://www.npmjs.com/package/reality-map"
              icon={<Sparkles className="size-3.5" />}
            >
              npm / reality-map
            </Pill>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs font-mono text-muted-foreground">
        © {new Date().getFullYear()} Vishal Gurung · goblin · Crafted in Japan
        with too much coffee and just enough sleep.
      </footer>
    </main>
  );
}
