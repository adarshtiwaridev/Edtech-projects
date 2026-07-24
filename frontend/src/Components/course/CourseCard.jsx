import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Edit3, Trash2 } from "lucide-react";

const CourseCard = ({
  course = {},
  isTeacherView = false,
  onDelete,
  onEdit,
  detailPath,
  actionSlot,
}) => {
  const title = course.title || course.courseName || "Untitled Course";
  const description = course.description || course.courseDescription || "";
  const thumbnail = course.thumbnail || course.Thumbnails || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800";
  const studentsCount = course.studentsEnrolled?.length || course.studentsCount || 0;

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={thumbnail}
        alt={title}
        className="h-44 w-full object-cover"
      />

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg leading-tight">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {description}
        </p>

        {isTeacherView && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Students Enrolled: {studentsCount}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="font-black text-blue-600 dark:text-blue-400">₹{course.price}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            {course.level || "Beginner"}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {detailPath && (
            <Link
              to={detailPath}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <BookOpen size={16} />
              View
            </Link>
          )}

          {isTeacherView && (
            <>
              <button
                onClick={() => onEdit(course)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Edit3 size={16} />
                Edit
              </button>

              <button
                onClick={() => onDelete(course)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}

          {actionSlot}
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
