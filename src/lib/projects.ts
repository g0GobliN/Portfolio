export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  stack: string[];
  links?: { label: string; href: string }[];
  summary: string;
  story?: string[];
  highlights: string[];
  modules?: { name: string; description: string }[];
  challenges?: string[];
  coverImage?: string;
};

export const projects: Project[] = [
  {
    slug: "reality-map",
    name: "reality-map",
    tagline: "Visual architecture explorer for any JS/TS codebase.",
    year: "2025",
    role: "Creator · npm package · solo",
    stack: ["TypeScript", "Node.js", "AST", "CLI", "Open Source"],
    links: [
      { label: "npm", href: "https://www.npmjs.com/package/reality-map" },
      { label: "GitHub", href: "https://github.com/g0GobliN" },
    ],
    summary:
      "An open-source CLI that maps the real architecture of any JavaScript or TypeScript project. Zero config, zero upload — everything runs locally on your machine. Born out of a very simple frustration: I kept joining codebases and spending the first week just figuring out what talks to what. So I built the tool I wished existed.",
    story: [
      "Most architecture tools either want you to upload your source code to a cloud you don't trust, or they need a config file longer than the project itself. Neither felt right.",
      "reality-map walks your AST, builds the real import graph, and renders it as an interactive map you can actually explore. It's the kind of thing I wanted to give back to open source since I was a kid watching the credits roll on README files.",
    ],
    highlights: [
      "Zero configuration — point it at any repo and go",
      "Runs entirely local, no code ever leaves your machine",
      "Interactive visual graph of files, imports and dependencies",
      "Works with React, Next, Node, monorepos and plain TS",
      "Tiny footprint, no telemetry, no nonsense",
    ],
  },
  {
    slug: "autcaster",
    name: "Autcaster",
    tagline: "Camera-based live view & paid capture platform.",
    year: "2024 — 2025",
    role: "Solo IT Engineer · システム開発",
    stack: ["React", "Vite", "Node.js", "Stripe", "Firebase", "FFmpeg", "WebRTC", "MediaMTX"],
    summary:
      "A production platform where companies install our cameras at scenic or event locations, and end-users scan a QR code on-site to watch the live view and pay to capture the perfect shot. Four services, one developer, lots of coffee. The whole stack — capture flow, payments, admin tooling, on-prem agent — was built and is maintained solo.",
    story: [
      "Companies buy our hardware. Their visitors scan a QR, see themselves live through the lens, hit capture, pay, and walk away with the photo. Simple on the surface — under the hood it's WebRTC, MediaMTX, FFmpeg, Stripe and Firebase all holding hands politely.",
      "Solo-shipping four services means wearing every hat: frontend, backend, on-prem agent, billing, admin tooling, deploys. Not always easy, but you learn the whole stack the hard (and honest) way.",
    ],
    highlights: [
      "QR-driven end-user capture flow with live WebRTC preview",
      "Stripe B2C payments + Firebase Admin for auth and orders",
      "FFmpeg + MediaMTX media pipeline running on-prem",
      "Admin dashboard for cameras, QR codes, tickets and reports",
      "Designed, built and shipped solo — no team handoffs",
    ],
    challenges: [
      "Keeping the on-prem agent reliable across flaky venue networks",
      "Stitching WebRTC ↔ MediaMTX ↔ FFmpeg into one boring, predictable pipeline",
      "Making payments feel instant even when the camera is in the middle of nowhere",
    ],
    modules: [
      {
        name: "capture-ui",
        description: "React + Vite · port 8080 — end-user capture flow opened via QR code on-site",
      },
      {
        name: "capture-agent",
        description:
          "Node.js · port 3001 — on-premise capture API, Stripe B2C, Firebase Admin, FFmpeg",
      },
      {
        name: "admin-ui",
        description: "React + Vite — admin dashboard: cameras, QR codes, settings, reports",
      },
      {
        name: "admin-backend",
        description: "Node.js · port 8082 — admin, billing, tickets, agent coordination",
      },
    ],
  },
  {
    slug: "siyakusho-truck-tracker",
    name: "Siyakusho Truck Tracker",
    tagline: "Camera-equipped garbage trucks with live route tracking for city hall.",
    year: "2024",
    role: "IT Engineer · システム開発",
    stack: ["React", "Node.js", "WebRTC", "Maps", "Camera"],
    summary:
      "A municipal (市役所 / siyakusho) project where garbage trucks were fitted with our cameras and tracked against their planned collection targets. The city hall side gets a live map, the truck side just drives — nobody has to fight with a UI to do their job.",
    highlights: [
      "Live camera feed from each truck",
      "Route tracking vs. target collection points",
      "Built for non-technical municipal operators",
      "Same camera DNA reused from the Autcaster stack",
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
