import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { createPharmacy, deletePharmacy } from "./actions";

// Tell Next this is dynamic, since Firestore data changes
export const dynamic = "force-dynamic";

async function getPharmacies() {
  const q = query(
    collection(db, "pharmacies"),
    orderBy("name")
  );

  const snap = await getDocs(q);
  const list = snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  return list;
}

export default async function AdminPharmaciesPage() {
  const pharmacies = await getPharmacies();

  return (
    <div className="space-y-8">
      {/* Header + create form card */}
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Pharmacies
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage participating community pharmacies and their details.
          </p>
        </div>
      </header>

      {/* Create new pharmacy */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">
          Add a new pharmacy
        </h2>
        <form
          action={createPharmacy}
          className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
        >
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Name *
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. CityCare Pharmacy"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Address
            </label>
            <input
              name="address"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 High Street"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              City / Town
            </label>
            <input
              name="city"
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Southampton"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Contact phone
            </label>
            <input
              name="contactPhone"
              type="tel"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+44 1234 567890"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Contact email
            </label>
            <input
              name="contactEmail"
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="info@pharmacy.co.uk"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Latitude (for map)
            </label>
            <input
              name="lat"
              type="number"
              step="any"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50.9097"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Longitude (for map)
            </label>
            <input
              name="lng"
              type="number"
              step="any"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-1.4043"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-1">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Save pharmacy
            </button>
          </div>
        </form>
      </section>

      {/* List of pharmacies */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Existing pharmacies
          </h2>
          <p className="text-xs text-slate-500">
            {pharmacies.length} in total
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {pharmacies.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No pharmacies yet. Use the form above to add one.
                  </td>
                </tr>
              ) : (
                pharmacies.map((pharmacy) => (
                  <tr key={pharmacy.id}>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {pharmacy.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {pharmacy.address || "—"}
                      {pharmacy.city ? `, ${pharmacy.city}` : ""}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {pharmacy.contactPhone && (
                        <span className="block">{pharmacy.contactPhone}</span>
                      )}
                      {pharmacy.contactEmail && (
                        <span className="block text-xs text-slate-500">
                          {pharmacy.contactEmail}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/pharmacies/${pharmacy.id}`}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deletePharmacy(pharmacy.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
