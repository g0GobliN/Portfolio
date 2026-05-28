import React from "react";

export function Pill({
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

export function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-l-2 border-primary pl-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-foreground text-sm font-medium">{v}</div>
    </div>
  );
}

export function SkillBlock({ title, items }: { title: string; items: string[] }) {
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
