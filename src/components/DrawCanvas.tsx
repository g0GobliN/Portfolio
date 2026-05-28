import React, { useState, useRef, useEffect } from "react";
import { Pencil, Eraser, Trash2 } from "lucide-react";
import { saveDoodle } from "@/lib/firebase";

const CANVAS_BG = "#1a1726";
const PALETTE = ["#ff8a3d", "#28dcff", "#ffffff", "#b388ff", "#7CFFB2", "#ff5577"];

export function DrawCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState("#ff8a3d");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  // form states
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitDone, setSubmitDone] = useState(false);

  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

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
