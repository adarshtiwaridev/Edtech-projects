import React from "react";

const CourseDetail = ({ course, ctaSlot, showLockedPreview = true }) => {
  const sections = course?.courseContent || course?.sections || [];
  const totalLectures = sections.reduce((count, section) => {
    const items = section?.subsections || section?.lectures || [];
    return count + items.length;
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover" />

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{course.description}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Instructor: {course.instructorName}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {sections.length} sections • {totalLectures} lectures • {course.studentsCount || 0} students enrolled
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">${course.price}</p>
          {ctaSlot}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Sections</h2>
          <div className="space-y-2">
            {sections.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">No sections available yet.</p>
            )}

            {sections.map((section, index) => (
              <div
                key={section._id || section.id || index}
                className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3"
              >
                <h3 className="font-semibold">{section.sectionName || section.title || `Section ${index + 1}`}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {(section.subsections || section.lectures || []).length} lectures
                </p>
                {showLockedPreview && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Content preview locked. Buy or enroll to unlock lectures.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
