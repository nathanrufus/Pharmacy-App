"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // 1. Create auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Optionally update displayName in Firebase Auth
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      // 3. Create Firestore users document with default role 'user'
      const userDocRef = doc(db, "users", cred.user.uid);
      await setDoc(userDocRef, {
        uid: cred.user.uid,
        name,
        email,
        role: "user",          // default role
        createdAt: new Date(),
      });

      // 4. Redirect to main user area (we'll build /browse later)
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create an account
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
