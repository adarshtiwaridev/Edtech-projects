import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import { createCategory, fetchCategories } from "../../../slices/courseSlice";

const emptyForm = {
  categoryName: "",
  description: "",
};

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.course);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const canSubmit = useMemo(() => {
    return form.categoryName.trim() && form.description.trim();
  }, [form.categoryName, form.description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please enter a category name and description");
      return;
    }

    setSubmitting(true);
    const result = await dispatch(createCategory(form));
    if (!result.error) {
      toast.success("Category created successfully");
      setForm(emptyForm);
    } else {
      toast.error(result.payload || "Unable to create category");
    }
    setSubmitting(false);
  };

  return (
    <DashboardLayout title="Manage Categories">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold">Category Name</span>
            <input
              required
              value={form.categoryName}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryName: e.target.value }))}
              placeholder="e.g. Web Development"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold">Description</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Short description of the category"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
            />
          </label>
        </div>

        <button
          disabled={loading || submitting}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {loading || submitting ? "Creating..." : "Create Category"}
        </button>
      </form>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold">Available Categories</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">{categories.length} total</span>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No categories created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <article
                key={category._id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2"
              >
                <h3 className="font-bold text-lg">{category.categoryName || category.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {category.description || "No description provided"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default AdminCategoriesPage;
