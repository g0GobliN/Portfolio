import { createFileRoute, Link } from "@tanstack/react-router";
import { getDbBlogs, getDoodles, saveDoodle, type Blog, type Doodle } from "@/lib/firebase";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  Eraser,
  Trash2,
  Menu,
  Briefcase,
  BookOpen,
  User,
  Wrench,
} from "lucide-react";
import avatar from "@/img/IMG_4029.jpg";
import goblinLogo from "@/img/goblin.webp";

const Hero3D = lazy(() => import("@/components/Hero3D"));

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
    return [...doodles].sort(() => Math.random() - 0.5).slice(0, 9);
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
        {/* 3-D canvas — client only */}
        <div className="absolute inset-0 z-0">
          {mounted && (
            <Suspense
              fallback={<div className="absolute inset-0 bg-[#0a0a12]" />}
            >
              <Hero3D />
            </Suspense>
          )}
        </div>

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
          onSelect={(d) => { setDoodleOpen(false); setSelectedDoodle(d); }}
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

// ─── Floating Navbar ──────────────────────────────────────────────────────────

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ width: "min(960px, calc(100% - 1.5rem))" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between"
    >
      {/* Logo */}
      <a href="#top" className="flex items-center gap-2 shrink-0">
        <img src={goblinLogo} alt="goblin" className="h-8 w-auto" />
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1">
        {[
          { label: "Work", to: "/work" as const },
          { label: "Blog", to: "/blog" as const },
        ].map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
          >
            {label}
          </Link>
        ))}
        {[
          { label: "Doodles", href: "#doodles" },
          { label: "About", href: "#about" },
          { label: "Skills", href: "#skills" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <a
          href="mailto:grgvishal.gurung17@gmail.com"
          className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/40 transition"
        >
          Say hi
        </a>
        <MobileMenuButton />
      </div>
    </motion.nav>
  );
}

// ─── Doodle Gallery (used in modal) ──────────────────────────────────────────

function seededRange(seed: string, min: number, max: number): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++)
    h = ((h << 5) + h + seed.charCodeAt(i)) & 0x7fffffff;
  return min + (h % (max - min + 1));
}

function DoodleCard({ doodle }: { doodle: Doodle }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth || 208;
    const h = canvas.offsetHeight || Math.round((w * 156) / 208);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const dark = doodle.createInDarkMode as boolean;
    ctx.fillStyle = dark ? "#141210" : "#f0ede8";
    ctx.fillRect(0, 0, w, h);

    const imgSrc = doodle.doodle as string;
    if (imgSrc && typeof imgSrc === "string" && imgSrc.length > 100) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
        const text = doodle.text as string;
        const pos = doodle.position as
          | { x?: number; y?: number; rotation?: number }
          | undefined;
        if (text && pos) {
          const px = ((pos.x ?? 50) / 100) * w;
          const py = ((pos.y ?? 50) / 100) * h;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(pos.rotation ?? 0);
          ctx.font = `bold ${Math.round(w * 0.048)}px monospace`;
          ctx.fillStyle = dark ? "#ffffff" : "#111111";
          ctx.strokeStyle = dark ? "#00000088" : "#ffffff88";
          ctx.lineWidth = 3;
          ctx.textAlign = "left";
          ctx.strokeText(text, 0, 0);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      };
      img.src = imgSrc;
    }
  }, [doodle]);

  const title = (doodle.name as string) || "untitled";
  const ts = (doodle.timestamp as string) || "";

  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#fdfaf2] p-2 pb-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]">
      <canvas ref={canvasRef} width={208} height={156} className="w-full block rounded" />
      <div className="mt-1.5 px-1">
        <p className="text-[10px] font-mono text-neutral-700 truncate font-medium">
          {title}
        </p>
        {ts && (
          <p className="text-[9px] font-mono text-neutral-500">{ts}</p>
        )}
      </div>
    </div>
  );
}

// ─── Doodle Modal (all sketches grid) ────────────────────────────────────────

function DoodleModal({
  open,
  onClose,
  doodles,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  doodles: Doodle[];
  onSelect: (d: Doodle) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary neon-text">
            Doodle board
          </span>
          <h2 className="text-2xl font-semibold mt-0.5">
            All sketches{" "}
            <span className="text-muted-foreground text-base font-normal">
              ({doodles.length})
            </span>
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-12">
          {doodles.map((d) => {
            const rot = seededRange(d.id, -7, 7);
            const ty = seededRange(d.id + "ty", -16, 16);
            return (
              <motion.button
                key={d.id}
                style={{ rotate: rot, y: ty }}
                whileHover={{ rotate: 0, y: 0, scale: 1.06, zIndex: 5 }}
                onClick={() => onSelect(d)}
                className="relative text-left w-full cursor-pointer focus:outline-none"
              >
                <DoodleCard doodle={d} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Doodle Lightbox (single doodle fullscreen) ───────────────────────────────

function DoodleLightbox({
  doodle,
  onClose,
}: {
  doodle: Doodle | null;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render doodle whenever it changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !doodle) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth || 720;
    const h = canvas.offsetHeight || Math.round((w * 9) / 16);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const dark = doodle.createInDarkMode as boolean;
    ctx.fillStyle = dark ? "#1a1726" : "#f0ede8";
    ctx.fillRect(0, 0, w, h);

    const imgSrc = doodle.doodle as string;
    if (imgSrc && typeof imgSrc === "string" && imgSrc.length > 100) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      img.src = imgSrc;
    }
  }, [doodle]);

  // Lock scroll while open and restore position on close
  useEffect(() => {
    if (!doodle) return;
    const y = window.scrollY;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      requestAnimationFrame(() => window.scrollTo(0, y));
    };
  }, [doodle]);

  // Close on Escape
  useEffect(() => {
    if (!doodle) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [doodle, onClose]);

  if (!doodle) return null;

  const name = (doodle.name as string) || "anonymous";
  const note = (doodle.text as string) || "";
  const ts   = (doodle.timestamp as string) || "";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl glass rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-black/60 transition cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full block"
          style={{ aspectRatio: "16/9" }}
        />

        {/* Info bar */}
        <div className="px-6 py-5 border-t border-white/8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full bg-primary neon-ring shrink-0" />
            <span className="text-sm font-semibold truncate">{name}</span>
          </div>
          {note && (
            <p className="text-sm text-muted-foreground italic flex-1 truncate">
              &ldquo;{note}&rdquo;
            </p>
          )}
          {ts && (
            <span className="text-[10px] font-mono text-muted-foreground/50 shrink-0 ml-auto">
              {ts}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Draw Canvas ─────────────────────────────────────────────────────────────

const PALETTE = ["#ff8a3d", "#28dcff", "#ffffff", "#b388ff", "#7CFFB2", "#ff5577"];

function DrawCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const CANVAS_BG = "#1a1726";

  const fillBackground = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (canvasRef.current) fillBackground(canvasRef.current);
  }, []);

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawing.current = true;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e, canvas);
    const last = lastPos.current;
    if (!last) {
      lastPos.current = pos;
      return;
    }
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? CANVAS_BG : color;
    ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    drawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    if (canvasRef.current) fillBackground(canvasRef.current);
  };

  const isCanvasEmpty = (canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return true;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // #1a1726 = rgb(26, 23, 38)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 26 || data[i + 1] !== 23 || data[i + 2] !== 38) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (isCanvasEmpty(canvas)) {
      setSubmitError("Draw something first.");
      setTimeout(() => setSubmitError(""), 3000);
      return;
    }
    const dataUrl = canvas.toDataURL("image/png");
    setSubmitting(true);
    setSubmitError("");
    try {
      await saveDoodle({
        name: authorName.trim() || "anonymous",
        text: message.trim(),
        doodle: dataUrl,
        timestamp: new Date().toISOString().split("T")[0],
        createInDarkMode: true,
      });
      setSubmitDone(true);
      clearCanvas();
      setAuthorName("");
      setMessage("");
      setTimeout(() => setSubmitDone(false), 5000);
    } catch {
      setSubmitError("Send failed — try again.");
      setTimeout(() => setSubmitError(""), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Canvas */}
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          width={1200}
          height={600}
          className="w-full h-[360px] sm:h-[440px] block touch-none cursor-crosshair"
          style={{ background: CANVAS_BG }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={(e) => {
            e.preventDefault();
            startDraw(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setTool("pen");
              }}
              style={{ backgroundColor: c }}
              className={`h-7 w-7 rounded-full border-2 transition-transform cursor-pointer ${
                color === c && tool === "pen"
                  ? "border-white scale-110"
                  : "border-transparent hover:scale-105"
              }`}
            />
          ))}
        </div>

        {/* Brush sizes */}
        <div className="flex items-center gap-1.5">
          {[2, 4, 8, 14].map((s) => (
            <button
              key={s}
              onClick={() => setBrushSize(s)}
              className={`h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition ${
                brushSize === s
                  ? "border-primary text-primary"
                  : "border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                style={{
                  width: Math.min(s * 1.4, 14),
                  height: Math.min(s * 1.4, 14),
                  borderRadius: "50%",
                  backgroundColor: "currentColor",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>

        {/* Tool buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setTool("pen")}
            className={`p-1.5 rounded-lg border cursor-pointer transition ${
              tool === "pen"
                ? "border-primary bg-primary/10 text-primary"
                : "border-white/10 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`p-1.5 rounded-lg border cursor-pointer transition ${
              tool === "eraser"
                ? "border-primary bg-primary/10 text-primary"
                : "border-white/10 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eraser className="size-3.5" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Name + message + submit */}
      <div className="mt-3">
        {submitDone ? (
          <p className="text-xs font-mono text-green-400 text-center py-2">
            ✓ doodle sent! thanks for leaving a mark.
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="your name (optional)"
              maxLength={30}
              className="sm:w-40 flex-1 min-w-[160px] bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition"
            />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="leave a message..."
              maxLength={100}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium neon-ring hover:scale-[1.03] transition-transform cursor-pointer disabled:opacity-50 shrink-0"
            >
              {submitting ? "sending..." : "Submit"}
            </button>
            {submitError && (
              <span className="text-xs font-mono text-red-400 shrink-0">
                {submitError}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mobile Nav ──────────────────────────────────────────────────────────────

const mobileMenuOpen = { value: false, listeners: new Set<() => void>() };

function useMobileMenu() {
  const [open, setOpen] = useState(mobileMenuOpen.value);
  useEffect(() => {
    const handler = () => setOpen(mobileMenuOpen.value);
    mobileMenuOpen.listeners.add(handler);
    return () => {
      mobileMenuOpen.listeners.delete(handler);
    };
  }, []);
  const toggle = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    mobileMenuOpen.listeners.forEach((l) => l());
  };
  const close = () => {
    mobileMenuOpen.value = false;
    mobileMenuOpen.listeners.forEach((l) => l());
  };
  return { open, toggle, close };
}

function MobileMenuButton() {
  const { open, toggle } = useMobileMenu();
  return (
    <button
      onClick={toggle}
      className="md:hidden p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/40 transition cursor-pointer"
      aria-label="Toggle menu"
    >
      {open ? <X className="size-4" /> : <Menu className="size-4" />}
    </button>
  );
}

function MobileNav() {
  const { open, close } = useMobileMenu();
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 md:hidden bg-black/30" onClick={close} />
      <div className="fixed top-16 right-3 z-50 md:hidden glass rounded-2xl border border-white/10 shadow-xl">
        <nav className="flex flex-col px-2 py-2 min-w-[180px]">
          <Link
            to="/work"
            onClick={close}
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-2.5 rounded-xl hover:bg-white/5"
          >
            <Briefcase className="size-3.5 shrink-0" /> Work
          </Link>
          <Link
            to="/blog"
            onClick={close}
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-2.5 rounded-xl hover:bg-white/5"
          >
            <BookOpen className="size-3.5 shrink-0" /> Blog
          </Link>
          <a
            href="#doodles"
            onClick={close}
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-2.5 rounded-xl hover:bg-white/5"
          >
            <Pencil className="size-3.5 shrink-0" /> Doodles
          </a>
          <a
            href="#about"
            onClick={close}
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-2.5 rounded-xl hover:bg-white/5"
          >
            <User className="size-3.5 shrink-0" /> About
          </a>
          <a
            href="#skills"
            onClick={close}
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-2.5 rounded-xl hover:bg-white/5"
          >
            <Wrench className="size-3.5 shrink-0" /> Skills
          </a>
          <a
            href="mailto:grgvishal.gurung17@gmail.com"
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-2.5 rounded-xl hover:bg-white/5"
          >
            <Mail className="size-3.5 shrink-0" /> Contact
          </a>
        </nav>
      </div>
    </>
  );
}

// ─── Shared components ───────────────────────────────────────────────────────

function Pill({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 glass hover:border-primary/30 text-xs font-mono transition text-muted-foreground hover:text-foreground"
    >
      {icon}
      {children}
    </a>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-l-2 border-primary pl-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-foreground text-sm font-medium">{v}</div>
    </div>
  );
}

function SkillBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-6 hover:border-primary/20 transition-colors">
      <div className="text-sm font-semibold text-primary neon-text mb-3">{title}</div>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary">›</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
