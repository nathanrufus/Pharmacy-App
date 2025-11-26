import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound, redirect } from "next/navigation";
import { updatePharmacy, deletePharmacy } from "../actions";

async function getPharmacy(id) {
  if (!id || typeof id !== "string") {
    return null;
  }

  const ref = doc(db, "pharmacies", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}

export default async function EditPharmacyPage({ params }) {
  // Next 16: params is a Promise
  const { id } = await params;

  const pharmacy = await getPharmacy(id);
  if (!pharmacy) {
    notFound();
  }

  const location = pharmacy.location || {};
  const lat = location.lat ?? "";
  const lng = location.lng ?? "";

  async function handleUpdate(formData) {
    "use server";
    await updatePharmacy(id, formData);
    redirect("/admin/pharmacies");
  }

  async function handleDelete() {
    "use server";
    await deletePharmacy(id);
    redirect("/admin/pharmacies");
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Edit pharmacy
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Update details for {pharmacy.name}.
          </p>
        </div>
      </header>

      {/* Card wrapper so we can have two sibling forms inside */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {/* UPDATE FORM */}
        <form action={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Name *
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={pharmacy.name}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Address
            </label>
            <input
              name="address"
              type="text"
              defaultValue={pharmacy.address || ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              City / Town
            </label>
            <input
              name="city"
              type="text"
              defaultValue={pharmacy.city || ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Contact phone
              </label>
              <input
                name="contactPhone"
                type="tel"
                defaultValue={pharmacy.contactPhone || ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Contact email
              </label>
              <input
                name="contactEmail"
                type="email"
                defaultValue={pharmacy.contactEmail || ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Latitude
              </label>
              <input
                name="lat"
                type="number"
                step="any"
                defaultValue={lat}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Longitude
              </label>
              <input
                name="lng"
                type="number"
                step="any"
                defaultValue={lng}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-start pt-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Save changes
            </button>
          </div>
        </form>

        {/* DELETE FORM – sibling, not nested */}
        <form action={handleDelete} className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete pharmacy
          </button>
        </form>
      </div>
    </div>
  );
}
