import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { notFound, redirect } from "next/navigation";
import { updateProduct, deleteProduct } from "../actions";

async function getProduct(id) {
  if (!id || typeof id !== "string") {
    return null;
  }
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

async function getPharmacies() {
  const snap = await getDocs(
    query(collection(db, "pharmacies"), orderBy("name"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export default async function EditProductPage({ params }) {
  // Next 16: params is a Promise
  const { id } = await params;

  const [product, pharmacies] = await Promise.all([
    getProduct(id),
    getPharmacies(),
  ]);

  if (!product) {
    notFound();
  }

  async function handleUpdate(formData) {
    "use server";
    await updateProduct(id, formData);
    redirect("/admin/products");
  }

  async function handleDelete() {
    "use server";
    await deleteProduct(id);
    redirect("/admin/products");
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Edit product
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Update details for {product.name}.
          </p>
        </div>
      </header>

      {/* Wrapper card so we can have two sibling forms inside */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {/* UPDATE FORM */}
        <form action={handleUpdate} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Product name *
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={product.name}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Category
              </label>
              <input
                name="category"
                type="text"
                defaultValue={product.category || ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Dosage
              </label>
              <input
                name="dosage"
                type="text"
                defaultValue={product.dosage || ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Price (£)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product.price ?? ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Quantity in stock
              </label>
              <input
                name="quantity"
                type="number"
                min="0"
                defaultValue={product.quantity ?? ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Expiry date
              </label>
              <input
                name="expiryDate"
                type="date"
                defaultValue={product.expiryDate || ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Health info / usage / side effects
            </label>
            <textarea
              name="healthInfo"
              rows={3}
              defaultValue={product.healthInfo || ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Pharmacy *
            </label>
            <select
              name="pharmacyId"
              required
              defaultValue={product.pharmacyId}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select pharmacy…</option>
              {pharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
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

        <form action={handleDelete} className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete product
          </button>
        </form>
      </div>
    </div>
  );
}
