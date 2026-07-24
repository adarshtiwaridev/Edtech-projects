import React from "react";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
    <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
    <div className="h-5 mt-4 rounded bg-slate-200 dark:bg-slate-800" />
    <div className="h-4 mt-2 rounded bg-slate-200 dark:bg-slate-800 w-2/3" />
    <div className="h-8 mt-4 rounded bg-slate-200 dark:bg-slate-800" />
  </div>
);

export default SkeletonCard;
