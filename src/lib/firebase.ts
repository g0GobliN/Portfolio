import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { projects as staticProjects, type Project } from "./projects";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-api-key-for-firestore-public",
  authDomain: "portfolioblog-9dc43.firebaseapp.com",
  projectId: "portfolioblog-9dc43",
  storageBucket: "portfolioblog-9dc43.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function uploadProjectImage(slug: string, file: File): Promise<string> {
  const storageRef = ref(storage, `projects/${slug}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export type Blog = {
  slug: string;
  title: string;
  tagline: string;
  content: string;
  publishedAt: string;
  coverImage?: string;
  tags: string[];
  updatedAt?: number;
};

// Seeding logic
export async function seedInitialProjects() {
  try {
    for (const p of staticProjects) {
      const ref = doc(db, "projects", p.slug);
      await setDoc(ref, {
        ...p,
        updatedAt: Date.now()
      });
    }
    console.log("Firestore successfully seeded with local projects!");
  } catch (error) {
    console.error("Error seeding projects:", error);
  }
}

// Admin passcode verification
export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  try {
    const docRef = doc(db, "admin", "config");
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Create default passcode document if it does not exist yet
      await setDoc(docRef, { passcode: "admin" });
      return passcode === "admin";
    }
    return docSnap.data().passcode === passcode;
  } catch (error) {
    console.error("Error verifying passcode:", error);
    // If it fails (e.g. firestore permission error), fallback to "admin"
    return passcode === "admin";
  }
}

export async function updateAdminPasscode(newPasscode: string): Promise<void> {
  const docRef = doc(db, "admin", "config");
  await setDoc(docRef, { passcode: newPasscode }, { merge: true });
}

// CRUD Projects
export async function getDbProjects(): Promise<Project[]> {
  try {
    const q = query(collection(db, "projects"), orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results: Project[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as Project);
    });

    if (results.length === 0) {
      // Auto-seed on first fetch if completely empty
      await seedInitialProjects();
      return staticProjects;
    }
    return results;
  } catch (error) {
    console.warn("Failed to fetch projects from Firestore, falling back to static local data:", error);
    return staticProjects;
  }
}

export async function getDbProject(slug: string): Promise<Project | null> {
  try {
    const docRef = doc(db, "projects", slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Project;
    }
    // Fallback to static projects
    const staticProj = staticProjects.find(p => p.slug === slug);
    return staticProj || null;
  } catch (error) {
    console.warn(`Failed to fetch project ${slug} from Firestore, falling back to static local data:`, error);
    const staticProj = staticProjects.find(p => p.slug === slug);
    return staticProj || null;
  }
}

export async function saveDbProject(project: Project): Promise<void> {
  const docRef = doc(db, "projects", project.slug);
  await setDoc(docRef, {
    ...project,
    updatedAt: Date.now()
  });
}

export async function deleteDbProject(slug: string): Promise<void> {
  const docRef = doc(db, "projects", slug);
  await deleteDoc(docRef);
}

// CRUD Blogs
export async function getDbBlogs(): Promise<Blog[]> {
  try {
    const q = query(collection(db, "blogs"), orderBy("publishedAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results: Blog[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as Blog);
    });
    return results;
  } catch (error) {
    console.warn("Failed to fetch blogs from Firestore:", error);
    return [];
  }
}

export async function getDbBlog(slug: string): Promise<Blog | null> {
  try {
    const docRef = doc(db, "blogs", slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Blog;
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch blog ${slug} from Firestore:`, error);
    return null;
  }
}

export async function saveDbBlog(blog: Blog): Promise<void> {
  const docRef = doc(db, "blogs", blog.slug);
  await setDoc(docRef, {
    ...blog,
    updatedAt: Date.now()
  });
}

export async function deleteDbBlog(slug: string): Promise<void> {
  const docRef = doc(db, "blogs", slug);
  await deleteDoc(docRef);
}

// --- Doodle project (doodlenotepad-4d983) via REST API ---

const DOODLE_PROJECT = "doodlenotepad-4d983";

async function getDoodleAuthToken(): Promise<string> {
  const apiKey = import.meta.env.VITE_DOODLE_API_KEY;
  if (!apiKey) throw new Error("VITE_DOODLE_API_KEY not set");
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ returnSecureToken: true }) }
  );
  if (!res.ok) throw new Error(`Doodle auth failed: ${await res.text()}`);
  const data = await res.json();
  return data.idToken as string;
}

export type Doodle = {
  id: string;
  name?: string;
  doodle?: string;            // data URL of the canvas image
  text?: string;              // text annotation
  position?: { x?: number; y?: number; rotation?: number };
  timestamp?: string;
  createInDarkMode?: boolean;
  [key: string]: unknown;
};

function parseFirestoreValue(value: Record<string, unknown>): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return parseInt(value.integerValue as string);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) {
    const arr = value.arrayValue as { values?: Array<Record<string, unknown>> };
    return (arr.values || []).map(parseFirestoreValue);
  }
  if ("mapValue" in value) {
    const map = value.mapValue as { fields?: Record<string, Record<string, unknown>> };
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(map.fields || {})) {
      result[k] = parseFirestoreValue(v);
    }
    return result;
  }
  if ("bytesValue" in value) return value.bytesValue;
  return undefined;
}

export async function saveDoodle(data: {
  name: string;
  text: string;
  doodle: string;
  timestamp: string;
  createInDarkMode: boolean;
}): Promise<void> {
  const res = await fetch(
    "https://firestore.googleapis.com/v1/projects/doodlenotepad-4d983/databases/(default)/documents/doodles",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          name: { stringValue: data.name },
          text: { stringValue: data.text },
          doodle: { stringValue: data.doodle },
          timestamp: { stringValue: data.timestamp },
          createInDarkMode: { booleanValue: data.createInDarkMode },
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`Failed to save doodle: ${await res.text()}`);
}

export async function deleteDoodle(id: string): Promise<void> {
  const token = await getDoodleAuthToken();
  const url = `https://firestore.googleapis.com/v1/projects/${DOODLE_PROJECT}/databases/(default)/documents/doodles/${id}`;
  const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok && res.status !== 404) {
    const body = await res.text();
    console.error(`[deleteDoodle] ${res.status} ${res.statusText}:`, body);
    throw new Error(`${res.status}: ${body}`);
  }
}

export async function getDoodles(): Promise<Doodle[]> {
  try {
    const res = await fetch(
      "https://firestore.googleapis.com/v1/projects/doodlenotepad-4d983/databases/(default)/documents/doodles?pageSize=50"
    );
    if (!res.ok) {
      console.warn("Doodle fetch failed:", res.status, await res.text());
      return [];
    }
    const data = await res.json();
    const documents = (data.documents || []) as Array<Record<string, unknown>>;
    return documents.map((docData) => {
      const name = docData.name as string;
      const id = name.split("/").pop() as string;
      const fields = (docData.fields || {}) as Record<string, Record<string, unknown>>;
      const parsed: Record<string, unknown> = { id };
      for (const [key, val] of Object.entries(fields)) {
        parsed[key] = parseFirestoreValue(val);
      }
      return parsed as Doodle;
    });
  } catch (err) {
    console.warn("Failed to fetch doodles:", err);
    return [];
  }
}
