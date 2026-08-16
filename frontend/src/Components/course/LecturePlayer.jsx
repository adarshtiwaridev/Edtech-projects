import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Play, CheckCircle, Volume2, AlertTriangle, RefreshCw, Award } from "lucide-react";
import { getCourseProgressApi, updateCourseProgressApi, generateCertificateApi } from "../../services/courseService";
import { useNavigate } from "react-router-dom";

const LecturePlayer = ({ course }) => {
  const courseId = course?._id || course?.id;
  const videoRef = useRef(null);

  const lectures = useMemo(() => {
    const sections = course?.courseContent || course?.sections || [];
    return sections.flatMap((section) => {
      const sectionTitle = section.sectionName || section.title || "Section";
      const items = section.subsections || section.lectures || [];
      return items.map((lecture) => ({
        id: lecture._id || lecture.id,
        title: lecture.title || "Lecture",
        notes: lecture.description || lecture.notes || "",
        videoUrl: lecture.videourl || lecture.videoUrl || lecture.video || lecture.url || "",
        sectionTitle,
      }));
    });
  }, [course]);

  const navigate = useNavigate();
  const [activeLecture, setActiveLecture] = useState(lectures[0] || null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [progressStats, setProgressStats] = useState({ completedCount: 0, totalSubsections: lectures.length, progressPercentage: 0 });
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [videoError, setVideoError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [claimingCert, setClaimingCert] = useState(false);

  const handleClaimCertificate = async () => {
    if (!courseId) return;
    try {
      setClaimingCert(true);
      const res = await generateCertificateApi(courseId);
      if (res?.data?.verificationId) {
        toast.success("Certificate issued successfully! 🎉");
        navigate(`/verify-certificate/${res.data.verificationId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to generate certificate.");
    } finally {
      setClaimingCert(false);
    }
  };

  useEffect(() => {
    if (lectures.length && !activeLecture) {
      setActiveLecture(lectures[0]);
    }
  }, [lectures]);

  const fetchProgress = async () => {
    if (!courseId) return;
    try {
      const res = await getCourseProgressApi(courseId);
      if (res?.progress?.completedVideos) {
        const ids = res.progress.completedVideos.map((v) => (typeof v === "object" ? v._id : v));
        setCompletedVideos(ids);
      }
      if (res?.progressPercentage !== undefined) {
        setProgressStats({
          completedCount: res.completedCount || 0,
          totalSubsections: res.totalSubsections || lectures.length,
          progressPercentage: res.progressPercentage || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [courseId]);

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleLectureCompletion = async (lectureId) => {
    if (!courseId || !lectureId) return;
    try {
      setUpdating(true);
      const isAlreadyDone = completedVideos.some((id) => String(id) === String(lectureId));
      const res = await updateCourseProgressApi({
        courseId,
        subSectionId: lectureId,
        completed: !isAlreadyDone,
      });

      if (res?.data?.progress) {
        const ids = res.data.progress.completedVideos.map((v) => (typeof v === "object" ? v._id : v));
        setCompletedVideos(ids);
        setProgressStats({
          completedCount: res.data.completedCount,
          totalSubsections: res.data.totalSubsections,
          progressPercentage: res.data.progressPercentage,
        });
        toast.success(isAlreadyDone ? "Marked as incomplete" : "Lecture completed!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update progress");
    } finally {
      setUpdating(false);
    }
  };

  if (!activeLecture) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
        <Play size={32} className="mx-auto text-slate-400" />
        <h3 className="font-bold text-lg">No Lectures Uploaded</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">This course does not have active video lectures uploaded yet.</p>
      </div>
    );
  }

  const isCurrentCompleted = completedVideos.some((id) => String(id) === String(activeLecture.id));

  return (
    <div className="space-y-6">
      {/* Course Dynamic Progress Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{course?.courseName || course?.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {progressStats.completedCount} of {progressStats.totalSubsections || lectures.length} lectures completed ({progressStats.progressPercentage}%)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-64 bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressStats.progressPercentage}%` }}
            />
          </div>
          {(progressStats.progressPercentage >= 100 || progressStats.completedCount >= (progressStats.totalSubsections || lectures.length)) && (
            <button
              disabled={claimingCert}
              onClick={handleClaimCertificate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <Award size={16} /> {claimingCert ? "Generating..." : "Claim Official Certificate"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Player Container */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{activeLecture.sectionTitle}</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{activeLecture.title}</h2>
              </div>
              <button
                disabled={updating}
                onClick={() => toggleLectureCompletion(activeLecture.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isCurrentCompleted
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
                }`}
              >
                <CheckCircle size={15} />
                {isCurrentCompleted ? "Completed" : "Mark Completed"}
              </button>
            </div>

            {/* HTML5 Video Player with Fallback & Speed Control */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              {videoError ? (
                <div className="p-6 text-center space-y-3 text-white">
                  <AlertTriangle size={36} className="mx-auto text-amber-400" />
                  <p className="text-sm font-semibold">Video Unplayable or Invalid Media URL</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    The uploaded video file standard or codec is not supported natively by HTML5 video player.
                  </p>
                  <button
                    onClick={() => {
                      setVideoError(false);
                      if (videoRef.current) videoRef.current.load();
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <RefreshCw size={14} /> Retry Loading
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  controls
                  controlsList="nodownload"
                  src={activeLecture.videoUrl}
                  onError={() => setVideoError(true)}
                  onEnded={() => {
                    if (!isCurrentCompleted) toggleLectureCompletion(activeLecture.id);
                  }}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Video Controls Bar: Playback Speed Selector */}
            <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Volume2 size={16} />
                <span className="font-semibold">HTML5 Quality: Auto</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Speed:</span>
                {[0.5, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      playbackRate === rate
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Lecture Notes & Materials */}
            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lecture Summary & Notes</h4>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {activeLecture.notes || "No extra notes provided for this lecture."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Lecture Playlist */}
        <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 max-h-[620px] overflow-auto shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm">Course Curriculum</h3>
            <span className="text-xs text-slate-500">{lectures.length} Lectures</span>
          </div>

          <div className="space-y-2">
            {lectures.map((lecture, idx) => {
              const isDone = completedVideos.some((id) => String(id) === String(lecture.id));
              const isSelected = activeLecture.id === lecture.id;
              return (
                <button
                  key={lecture.id || idx}
                  onClick={() => {
                    setVideoError(false);
                    setActiveLecture(lecture);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-start gap-3 border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className={`text-xs mt-0.5 font-bold ${isDone ? (isSelected ? "text-white" : "text-emerald-500") : "opacity-40"}`}>
                    {isDone ? "✓" : "○"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs leading-snug truncate">{lecture.title}</p>
                    <p className={`text-[11px] mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>{lecture.sectionTitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LecturePlayer;
