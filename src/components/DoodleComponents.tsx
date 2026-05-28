import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { type Doodle } from "@/lib/firebase";

function seededRange(seed: string, min: number, max: number): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++)
    h = ((h << 5) + h + seed.charCodeAt(i)) & 0x7fffffff;
  return min + (h % (max - min + 1));
}

export function DoodleCard({ doodle }: { doodle: Doodle }) {
  const title = (doodle.name as string) || "untitled";
  const ts = (doodle.timestamp as string) || "";
  const dark = doodle.createInDarkMode as boolean;
  return (
    <div className="w-full rounded-xl overflow-hidden bg-[#fdfaf2] p-2 pb-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] border border-[#e4dfd5]">
      <div 
        className="relative w-full rounded overflow-hidden aspect-[4/3]"
        style={{ backgroundColor: dark ? "#1a1726" : "#f0ede8" }}
      >
        {doodle.doodle && (
          <img
            src={doodle.doodle}
            alt={title}
            className="w-full h-full object-cover block animate-fade-in"
            loading="lazy"
          />
        )}
      </div>
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

export function DoodleModal({
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

export function DoodleLightbox({
  doodle,
  onClose,
}: {
  doodle: Doodle | null;
  onClose: () => void;
}) {
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
  const dark = doodle.createInDarkMode as boolean;

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

        {/* Image */}
        {doodle.doodle && (
          <img
            src={doodle.doodle}
            alt={name}
            className="w-full block object-contain"
            style={{ aspectRatio: "16/9", backgroundColor: dark ? "#1a1726" : "#f0ede8" }}
          />
        )}

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
