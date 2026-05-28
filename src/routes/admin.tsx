import { createFileRoute, Link } from "@tanstack/react-router";
import {
  getDbProjects,
  saveDbProject,
  deleteDbProject,
  getDbBlogs,
  saveDbBlog,
  deleteDbBlog,
  getDoodles,
  deleteDoodle,
  verifyAdminPasscode,
  updateAdminPasscode,
  uploadProjectImage,
  type Blog,
  type Doodle,
  type Project,
} from "@/lib/firebase";
import {
  ArrowLeft,
  Lock,
  Plus,
  Trash2,
  Edit3,
  Save,
  Database,
  FolderGit2,
  BookOpen,
  Settings,
  Check,
  KeyRound,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal — Vishal Gurung · goblin" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "blogs" | "doodles" | "settings">("projects");

  // State arrays
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [loadingDoodles, setLoadingDoodles] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [newPasscode, setNewPasscode] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [opError, setOpError] = useState("");
  const [opSuccess, setOpSuccess] = useState("");

  const refreshData = async () => {
    setLoading(true);
    try {
      const projs = await getDbProjects();
      const blgs = await getDbBlogs();
      setProjects(projs);
      setBlogs(blgs);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDoodles = async () => {
    setLoadingDoodles(true);
    try {
      const d = await getDoodles();
      setDoodles(d);
    } catch (err) {
      console.error("Error loading doodles:", err);
    } finally {
      setLoadingDoodles(false);
    }
  };

  const handleDeleteDoodle = async (id: string) => {
    if (!confirm("Delete this doodle permanently?")) return;
    try {
      await deleteDoodle(id);
      flash("Doodle deleted.");
      setDoodles((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete doodle failed:", err);
      flash(`Delete failed: ${err instanceof Error ? err.message : String(err)}`, true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const isOk = await verifyAdminPasscode(passcode);
    if (isOk) {
      setIsAuthenticated(true);
      localStorage.setItem("goblin_admin_auth", passcode);
      refreshData();
    } else {
      setAuthError("Access denied. Invalid credentials.");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("goblin_admin_auth");
    if (saved) {
      verifyAdminPasscode(saved).then((isOk) => {
        if (isOk) {
          setPasscode(saved);
          setIsAuthenticated(true);
          refreshData();
        } else {
          localStorage.removeItem("goblin_admin_auth");
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const flash = (msg: string, isError = false) => {
    if (isError) { setOpError(msg); setTimeout(() => setOpError(""), 4000); }
    else { setOpSuccess(msg); setTimeout(() => setOpSuccess(""), 3000); }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.slug || !editingProject?.name) return;

    const formatted: Project = {
      slug: editingProject.slug,
      name: editingProject.name,
      tagline: editingProject.tagline || "",
      year: editingProject.year || new Date().getFullYear().toString(),
      role: editingProject.role || "Developer",
      stack: Array.isArray(editingProject.stack)
        ? editingProject.stack
        : ((editingProject.stack as unknown) as string || "").split(",").map(s => s.trim()).filter(Boolean),
      summary: editingProject.summary || "",
      story: Array.isArray(editingProject.story)
        ? editingProject.story
        : ((editingProject.story as unknown) as string || "").split("\n\n").map(s => s.trim()).filter(Boolean),
      highlights: Array.isArray(editingProject.highlights)
        ? editingProject.highlights
        : ((editingProject.highlights as unknown) as string || "").split(",").map(s => s.trim()).filter(Boolean),
      challenges: Array.isArray(editingProject.challenges)
        ? editingProject.challenges
        : ((editingProject.challenges as unknown) as string || "").split(",").map(s => s.trim()).filter(Boolean),
      links: editingProject.links || [],
      modules: editingProject.modules || [],
      coverImage: editingProject.coverImage || "",
    };

    try {
      await saveDbProject(formatted);
      setEditingProject(null);
      flash("Project saved!");
      refreshData();
    } catch (err) {
      console.error("Save project failed:", err);
      flash("Save failed — check your Firebase API key in .env.local (VITE_FIREBASE_API_KEY).", true);
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject?.slug) return;
    setUploadingImage(true);
    try {
      const url = await uploadProjectImage(editingProject.slug, file);
      setEditingProject({ ...editingProject, coverImage: url });
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.slug || !editingBlog?.title) return;

    const formatted: Blog = {
      slug: editingBlog.slug,
      title: editingBlog.title,
      tagline: editingBlog.tagline || "",
      content: editingBlog.content || "",
      publishedAt: editingBlog.publishedAt || new Date().toISOString().split("T")[0],
      coverImage: editingBlog.coverImage || "",
      tags: Array.isArray(editingBlog.tags)
        ? editingBlog.tags
        : ((editingBlog.tags as unknown) as string || "").split(",").map(s => s.trim()).filter(Boolean),
    };

    try {
      await saveDbBlog(formatted);
      setEditingBlog(null);
      flash("Post saved!");
      refreshData();
    } catch (err) {
      console.error("Save blog failed:", err);
      flash("Save failed — check your Firebase API key in .env.local (VITE_FIREBASE_API_KEY).", true);
    }
  };

  const handleDeleteProject = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDbProject(slug);
      flash("Project deleted.");
      refreshData();
    } catch (err) {
      console.error("Delete project failed:", err);
      flash("Delete failed — check your Firebase API key in .env.local (VITE_FIREBASE_API_KEY).", true);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deleteDbBlog(slug);
      flash("Post deleted.");
      refreshData();
    } catch (err) {
      console.error("Delete blog failed:", err);
      flash("Delete failed — check your Firebase API key in .env.local (VITE_FIREBASE_API_KEY).", true);
    }
  };

const handlePasscodeUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode) return;
    await updateAdminPasscode(newPasscode);
    localStorage.setItem("goblin_admin_auth", newPasscode);
    setPasscode(newPasscode);
    setNewPasscode("");
    setSettingsSuccess("Passcode updated successfully!");
    setTimeout(() => setSettingsSuccess(""), 3000);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 size-20 rounded-full border border-primary/20 bg-card flex items-center justify-center text-primary shadow-glow">
            <Lock className="size-8" />
          </div>

          <h1 className="text-display text-center text-3xl mt-8">ADMIN GATEWAY</h1>
          <p className="text-center text-xs font-mono text-muted-foreground mt-2">
            goblin-s-overview · portfolioblog-9dc43
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted-foreground uppercase mb-2">
                Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter access code..."
                className="w-full rounded-lg border border-border bg-black/40 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition"
              />
            </div>

            {authError && (
              <p className="text-xs font-mono text-red-400 text-center">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-mono text-sm font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Verify Identity
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-mono text-muted-foreground hover:text-foreground transition underline">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 bg-background text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <FolderGit2 className="size-3 text-primary" /> Active session
            </div>
            <h1 className="text-display text-4xl sm:text-5xl mt-2">
              ADMIN <span className="text-primary">PANEL</span>
            </h1>
          </div>

          <div className="mt-4 sm:mt-0 flex gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-surface text-xs font-mono text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="size-3.5" /> Return Home
            </Link>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-border/60 mt-6 gap-2">
          <button
            onClick={() => { setActiveTab("projects"); setEditingProject(null); }}
            className={`px-4 py-2 border-b-2 text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
              activeTab === "projects"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => { setActiveTab("blogs"); setEditingBlog(null); }}
            className={`px-4 py-2 border-b-2 text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
              activeTab === "blogs"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Blogs
          </button>
          <button
            onClick={() => { setActiveTab("doodles"); if (doodles.length === 0) loadDoodles(); }}
            className={`px-4 py-2 border-b-2 text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
              activeTab === "doodles"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Doodles
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 border-b-2 text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
              activeTab === "settings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Settings
          </button>
        </div>

        {opError && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-mono text-red-400">
            ✗ {opError}
          </div>
        )}
        {opSuccess && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-xs font-mono text-green-400 flex items-center gap-1.5">
            <Check className="size-3.5" /> {opSuccess}
          </div>
        )}

        {loading ? (
          <div className="mt-12 text-center font-mono text-sm text-muted-foreground animate-pulse">
            ➜ fetching network nodes...
          </div>
        ) : (
          <div className="mt-8">
            {/* PROJECTS TAB */}
            {activeTab === "projects" && !editingProject && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-display text-xl">PROJECT DATABASE</h2>
                  <button
                    onClick={() =>
                      setEditingProject({
                        slug: "",
                        name: "",
                        tagline: "",
                        year: new Date().getFullYear().toString(),
                        role: "Developer",
                        stack: [],
                        summary: "",
                        story: [],
                        highlights: [],
                        challenges: [],
                        links: [],
                        modules: [],
                        coverImage: "",
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-mono text-xs hover:opacity-90 transition cursor-pointer"
                  >
                    <Plus className="size-3.5" /> Add Project
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((p) => (
                    <div
                      key={p.slug}
                      className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {p.year}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {p.slug}
                          </span>
                        </div>
                        <h3 className="text-display text-lg mt-3 text-foreground">{p.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {p.tagline}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-6 pt-4 border-t border-border/40 justify-end">
                        <button
                          onClick={() => setEditingProject(p)}
                          className="p-2 rounded-lg border border-border hover:bg-surface text-muted-foreground hover:text-primary transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.slug)}
                          className="p-2 rounded-lg border border-border hover:bg-surface text-muted-foreground hover:text-red-400 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECT EDIT/ADD FORM */}
            {activeTab === "projects" && editingProject && (
              <form onSubmit={handleSaveProject} className="max-w-3xl rounded-xl border border-border bg-card p-6 space-y-6">
                <h2 className="text-display text-xl border-b border-border/40 pb-3 text-primary">
                  {editingProject.slug ? "EDIT PROJECT" : "NEW PROJECT"}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Project Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.name || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                      placeholder="e.g. reality-map"
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Slug (URL identifier, unique)
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingProject.slug}
                      value={editingProject.slug || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                      placeholder="e.g. reality-map"
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Year
                    </label>
                    <input
                      type="text"
                      value={editingProject.year || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      placeholder="e.g. 2025"
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Role
                    </label>
                    <input
                      type="text"
                      value={editingProject.role || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                      placeholder="e.g. Creator · npm · Solo"
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={editingProject.tagline || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                    placeholder="Short catching tagline..."
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(editingProject.stack) ? editingProject.stack.join(", ") : (editingProject.stack || "")}
                    onChange={(e) => setEditingProject({ ...editingProject, stack: e.target.value as unknown as string[] })}
                    placeholder="e.js, TypeScript, Node.js, AST"
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    Summary Overview
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.summary || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                    placeholder="Detailed summary overview of what the project is..."
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    The Story (Separate paragraphs with double newlines)
                  </label>
                  <textarea
                    rows={5}
                    value={Array.isArray(editingProject.story) ? editingProject.story.join("\n\n") : (editingProject.story || "")}
                    onChange={(e) => setEditingProject({ ...editingProject, story: e.target.value as unknown as string[] })}
                    placeholder="Write details about origin story, ideas, etc..."
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Highlights (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      value={Array.isArray(editingProject.highlights) ? editingProject.highlights.join(", ") : (editingProject.highlights || "")}
                      onChange={(e) => setEditingProject({ ...editingProject, highlights: e.target.value as unknown as string[] })}
                      placeholder="Highlights of the project..."
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      What was actually hard / Challenges (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      value={Array.isArray(editingProject.challenges) ? editingProject.challenges.join(", ") : (editingProject.challenges || "")}
                      onChange={(e) => setEditingProject({ ...editingProject, challenges: e.target.value as unknown as string[] })}
                      placeholder="What was difficult..."
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    Cover Image
                  </label>
                  <div className="flex items-start gap-4">
                    {editingProject.coverImage && (
                      <img
                        src={editingProject.coverImage}
                        alt="Cover preview"
                        className="w-24 h-16 object-cover rounded-lg border border-border shrink-0"
                      />
                    )}
                    <label className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border bg-black/20 text-xs font-mono text-muted-foreground cursor-pointer hover:border-primary/50 hover:text-foreground transition ${!editingProject.slug ? "opacity-40 pointer-events-none" : ""}`}>
                      {uploadingImage ? (
                        <><Loader2 className="size-3.5 animate-spin" /> Uploading...</>
                      ) : (
                        <><ImagePlus className="size-3.5" /> {editingProject.coverImage ? "Replace image" : "Upload image"}</>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={!editingProject.slug || uploadingImage}
                        onChange={handleProjectImageUpload}
                      />
                    </label>
                  </div>
                  {!editingProject.slug && (
                    <p className="mt-1 text-[10px] font-mono text-muted-foreground/60">Set a slug first before uploading an image</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-border/40 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-lg border border-border font-mono text-xs hover:bg-surface transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-semibold hover:opacity-90 transition cursor-pointer"
                  >
                    <Save className="size-3.5" /> Save Project
                  </button>
                </div>
              </form>
            )}

            {/* BLOGS TAB */}
            {activeTab === "blogs" && !editingBlog && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-display text-xl">BLOG JOURNAL</h2>
                  <button
                    onClick={() =>
                      setEditingBlog({
                        slug: "",
                        title: "",
                        tagline: "",
                        content: "",
                        publishedAt: new Date().toISOString().split("T")[0],
                        coverImage: "",
                        tags: [],
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-mono text-xs hover:opacity-90 transition cursor-pointer"
                  >
                    <Plus className="size-3.5" /> Add Post
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((b) => (
                    <div
                      key={b.slug}
                      className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {b.publishedAt}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {b.slug}
                          </span>
                        </div>
                        <h3 className="text-display text-lg mt-3 text-foreground">{b.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {b.tagline}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-6 pt-4 border-t border-border/40 justify-end">
                        <button
                          onClick={() => setEditingBlog(b)}
                          className="p-2 rounded-lg border border-border hover:bg-surface text-muted-foreground hover:text-primary transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.slug)}
                          className="p-2 rounded-lg border border-border hover:bg-surface text-muted-foreground hover:text-red-400 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BLOG EDIT/ADD FORM */}
            {activeTab === "blogs" && editingBlog && (
              <form onSubmit={handleSaveBlog} className="max-w-3xl rounded-xl border border-border bg-card p-6 space-y-6">
                <h2 className="text-display text-xl border-b border-border/40 pb-3 text-primary">
                  {editingBlog.slug ? "EDIT POST" : "NEW POST"}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Post Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBlog.title || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      placeholder="e.g. My first deployment to Japan"
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Slug (URL key)
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingBlog.slug}
                      value={editingBlog.slug || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                      placeholder="e.g. my-first-deployment"
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={editingBlog.publishedAt || ""}
                      onChange={(e) => setEditingBlog({ ...editingBlog, publishedAt: e.target.value })}
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(editingBlog.tags) ? editingBlog.tags.join(", ") : (editingBlog.tags || "")}
                      onChange={(e) => setEditingBlog({ ...editingBlog, tags: e.target.value as unknown as string[] })}
                      placeholder="e.g. setup, nodejs, servers"
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                    Tagline (Brief description)
                  </label>
                  <input
                    type="text"
                    value={editingBlog.tagline || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, tagline: e.target.value })}
                    placeholder="One-liner summary of the post..."
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5 flex justify-between">
                    <span>Journal Content (Markdown support)</span>
                    <span className="text-[9px] text-muted-foreground/60">## sections, ```code</span>
                  </label>
                  <textarea
                    rows={12}
                    value={editingBlog.content || ""}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    placeholder="Write your beautiful content here..."
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t border-border/40 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingBlog(null)}
                    className="px-4 py-2 rounded-lg border border-border font-mono text-xs hover:bg-surface transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-semibold hover:opacity-90 transition cursor-pointer"
                  >
                    <Save className="size-3.5" /> Save Post
                  </button>
                </div>
              </form>
            )}

            {/* DOODLES TAB */}
            {activeTab === "doodles" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-display text-xl">DOODLE BOARD</h2>
                  <button
                    onClick={loadDoodles}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-surface text-xs font-mono text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    {loadingDoodles ? <Loader2 className="size-3.5 animate-spin" /> : <Database className="size-3.5 text-primary" />} Refresh
                  </button>
                </div>

                {loadingDoodles ? (
                  <div className="text-center font-mono text-sm text-muted-foreground animate-pulse py-12">
                    ➜ fetching doodles...
                  </div>
                ) : doodles.length === 0 ? (
                  <div className="text-center font-mono text-sm text-muted-foreground py-12">
                    No doodles found.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {doodles.map((d) => (
                      <div key={d.id} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
                        {d.doodle ? (
                          <img
                            src={d.doodle as string}
                            alt="doodle"
                            className="w-full aspect-[3/2] object-cover"
                            style={{ background: d.createInDarkMode ? "#141210" : "#f0ede8" }}
                          />
                        ) : (
                          <div className="w-full aspect-[3/2] bg-surface flex items-center justify-center text-xs font-mono text-muted-foreground">
                            no image
                          </div>
                        )}
                        <div className="p-3 flex flex-col gap-1 flex-1">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-mono text-foreground font-semibold truncate">
                              {(d.name as string) || "anonymous"}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground shrink-0 ml-2">
                              {(d.timestamp as string) || ""}
                            </span>
                          </div>
                          {d.text && (
                            <p className="text-[11px] font-mono text-muted-foreground italic truncate">
                              &ldquo;{d.text as string}&rdquo;
                            </p>
                          )}
                          <div className="mt-auto pt-2 flex justify-end">
                            <button
                              onClick={() => handleDeleteDoodle(d.id)}
                              className="p-1.5 rounded-lg border border-border hover:bg-surface text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition cursor-pointer"
                              title="Delete doodle"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="max-w-md rounded-xl border border-border bg-card p-6 space-y-6">
                <h2 className="text-display text-xl text-primary border-b border-border/40 pb-3 flex items-center gap-1.5">
                  <Settings className="size-5" /> SECURITY SETTINGS
                </h2>

                <form onSubmit={handlePasscodeUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground uppercase mb-1.5">
                      New Passcode
                    </label>
                    <input
                      type="password"
                      required
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Enter new admin code..."
                      className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm font-mono text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </div>

                  {settingsSuccess && (
                    <div className="text-xs font-mono text-green-400 flex items-center gap-1">
                      <Check className="size-3.5" /> {settingsSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-semibold hover:opacity-90 transition cursor-pointer"
                  >
                    <KeyRound className="size-4" /> Save Passcode
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
