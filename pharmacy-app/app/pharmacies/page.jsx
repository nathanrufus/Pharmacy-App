import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPharmacies() {
  const snap = await getDocs(
    query(collection(db, "pharmacies"), orderBy("name"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export default async function PharmaciesPage() {
  const pharmacies = await getPharmacies();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Pharmacies
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse participating community pharmacies and view their products.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pharmacies.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No pharmacies available yet. Please check back later.
          </div>
        ) : (
          pharmacies.map((pharmacy) => (
            <Link
              key={pharmacy.id}
              href={`/pharmacies/${pharmacy.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {pharmacy.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {pharmacy.address || "Address not set"}
                {pharmacy.city ? `, ${pharmacy.city}` : ""}
              </p>
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                {pharmacy.contactPhone && (
                  <p>Phone: {pharmacy.contactPhone}</p>
                )}
                {pharmacy.contactEmail && (
                  <p>Email: {pharmacy.contactEmail}</p>
                )}
              </div>
              <p className="mt-3 text-xs font-medium text-blue-600">
                View details →
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
