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


function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;
  let result = '';

  const words: number[] = [];
  const asciiLength = ascii[lengthProperty] * 8;
  
  let hash = (sha256 as any).h = (sha256 as any).h || [];
  const k = (sha256 as any).k = (sha256 as any).k || [];
  let primeCounter = 0;

  const isPrime = (n: number) => {
    for (let factor = 2; factor * factor <= n; factor++) {
      if (n % factor === 0) return false;
    }
    return true;
  };

  const getFractionalBits = (n: number) => {
    return ((n - Math.floor(n)) * maxWord) | 0;
  };

  if (!k[0]) {
    let candidate = 2;
    while (primeCounter < 64) {
      if (isPrime(candidate)) {
        if (primeCounter < 8) {
          hash[primeCounter] = getFractionalBits(mathPow(candidate, 1/2));
        }
        k[primeCounter] = getFractionalBits(mathPow(candidate, 1/3));
        primeCounter++;
      }
      candidate++;
    }
  }

  const hashCopy = hash.slice(0);
  const asciiBytes = Array.from(new TextEncoder().encode(ascii));
  
  asciiBytes.push(0x80);
  while (asciiBytes[lengthProperty] % 64 !== 56) {
    asciiBytes.push(0);
  }
  
  // 64-bit big-endian length. Since length < 2^32, high 32-bits are 0.
  asciiBytes.push(0, 0, 0, 0);
  for (i = 0; i < 4; i++) {
    asciiBytes.push((asciiLength >>> (24 - i * 8)) & 0xff);
  }

  for (i = 0; i < asciiBytes[lengthProperty]; i += 4) {
    words.push((asciiBytes[i] << 24) | (asciiBytes[i+1] << 16) | (asciiBytes[i+2] << 8) | asciiBytes[i+3]);
  }

  for (i = 0; i < words[lengthProperty]; i += 16) {
    const w = words.slice(i, i + 16);
    let a = hashCopy[0];
    let b = hashCopy[1];
    let c = hashCopy[2];
    let d = hashCopy[3];
    let e = hashCopy[4];
    let f = hashCopy[5];
    let g = hashCopy[6];
    let hVal = hashCopy[7];

    for (j = 0; j < 64; j++) {
      if (j >= 16) {
        const w15 = w[j - 15];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const w2 = w[j - 2];
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = s0 + maj;
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = hVal + s1 + ch + k[j] + (w[j] || 0);

      hVal = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }

    hashCopy[0] = (hashCopy[0] + a) | 0;
    hashCopy[1] = (hashCopy[1] + b) | 0;
    hashCopy[2] = (hashCopy[2] + c) | 0;
    hashCopy[3] = (hashCopy[3] + d) | 0;
    hashCopy[4] = (hashCopy[4] + e) | 0;
    hashCopy[5] = (hashCopy[5] + f) | 0;
    hashCopy[6] = (hashCopy[6] + g) | 0;
    hashCopy[7] = (hashCopy[7] + hVal) | 0;
  }

  for (i = 0; i < 8; i++) {
    const val = hashCopy[i] >>> 0;
    result += val.toString(16).padStart(8, '0');
  }
  return result;
}

// Admin passcode verification
export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  try {
    const docRef = doc(db, "admin", "config");
    const docSnap = await getDoc(docRef);
    const hashedInput = await sha256(passcode);
    
    if (!docSnap.exists()) {
      // Create default passcode document if it does not exist yet
      const hashedDefault = await sha256("admin");
      await setDoc(docRef, { passcode: hashedDefault });
      return passcode === "admin";
    }
    
    const storedPasscode = docSnap.data().passcode;
    const isSha256 = /^[a-f0-9]{64}$/i.test(storedPasscode);
    
    if (isSha256) {
      return storedPasscode === hashedInput;
    } else {
      // Legacy plain text comparison
      const matches = storedPasscode === passcode;
      if (matches) {
        // Auto-upgrade legacy passcode to hashed version
        await updateAdminPasscode(passcode);
      }
      return matches;
    }
  } catch (error) {
    console.error("Error verifying passcode:", error);
    // If it fails (e.g. firestore permission error), fallback to "admin"
    const hashedInput = await sha256(passcode);
    const hashedDefault = await sha256("admin");
    return hashedInput === hashedDefault;
  }
}

export async function updateAdminPasscode(newPasscode: string): Promise<void> {
  const hashed = await sha256(newPasscode);
  const docRef = doc(db, "admin", "config");
  await setDoc(docRef, { passcode: hashed }, { merge: true });
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

    return results;
  } catch (error) {
    console.warn("Failed to fetch projects from Firestore:", error);
    return [];
  }
}

export async function getDbProject(slug: string): Promise<Project | null> {
  try {
    const docRef = doc(db, "projects", slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Project;
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch project ${slug} from Firestore:`, error);
    return null;
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
