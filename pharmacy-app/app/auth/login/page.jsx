"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // 1. Sign in with Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // 2. Fetch role from Firestore
      const userDocRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userDocRef);

      let role = "user";
      if (snap.exists()) {
        const data = snap.data();
        role = data.role || "user";
      }

      // 3. Redirect based on role
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/browse");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Log in</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
