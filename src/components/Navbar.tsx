import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  X,
  Menu,
  Briefcase,
  BookOpen,
  Pencil,
  User,
  Wrench,
  Mail,
} from "lucide-react";
import goblinLogo from "@/img/goblin.webp";

const mobileMenuOpen = { value: false, listeners: new Set<() => void>() };

export function useMobileMenu() {
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

export function MobileMenuButton() {
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

export function Navbar() {
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

export function MobileNav() {
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
