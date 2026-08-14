import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BookOpen,
  ExternalLink,
  ArrowLeft,
  Download,
  Share2,
  Linkedin,
  Twitter,
  QrCode,
} from "lucide-react";
import apiClient from "../services/apiClient";
import toast from "react-hot-toast";

const PublicCertificateVerifyPage = () => {
  const { verificationId } = useParams();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyCert = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(
          `/v1/enhanced/certificates/verify/${verificationId}`
        );
        setCertData(res.data?.data);
      } catch (err) {
        setError(
          err.message || "Invalid or unverified certificate verification key"
        );
      } finally {
        setLoading(false);
      }
    };
    if (verificationId) {
      verifyCert();
    }
  }, [verificationId]);

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const response = await apiClient.get(
        `/v1/enhanced/certificates/download/${verificationId}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate-${verificationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Certificate PDF downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download PDF certificate");
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLinkedIn = () => {
    const certUrl = window.location.href;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      certUrl
    )}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareTwitter = () => {
    const certUrl = window.location.href;
    const text = `I'm proud to share my verified completion certificate for ${certData?.courseName || "Kodemates Course"} on Kodemates LMS! 🎉 Check verification:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(certUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mb-4"></div>
        <p className="text-sm text-slate-400 font-semibold">
          Verifying Certificate Credentials with Kodemates Ledger...
        </p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-xl">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl w-fit mx-auto">
            <Award size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">Certificate Not Found</h2>
          <p className="text-xs text-slate-400">
            {error ||
              "This verification ID does not exist in our institutional database."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
          >
            <ArrowLeft size={14} /> Return to Kodemates Home
          </Link>
        </div>
      </div>
    );
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    window.location.href
  )}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-6">
        {/* Top Header Card */}
        <div className="bg-slate-900/90 border border-emerald-500/30 p-6 rounded-3xl shadow-2xl flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl">
              <ShieldCheck size={32} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Official Verification Sealed
              </span>
              <h1 className="text-lg font-bold text-white mt-1">
                Authentic Completion Credential
              </h1>
              <p className="text-xs text-slate-400">
                Verification ID: {certData.verificationId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <Download size={14} />
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              Kodemates LMS <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Certificate Visual Presentation Card */}
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-center mb-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-3xl shadow-lg">
              <Award size={48} />
            </div>
          </div>

          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Certificate of Academic Achievement
          </p>
          <p className="text-xs text-slate-400 mt-1">This certifies that</p>
          <h2 className="text-3xl font-extrabold text-white my-3 tracking-tight">
            {certData.studentName}
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            has successfully completed all required modules, assessments, and
            practical exercises for the online curriculum
          </p>

          <div className="my-6 py-4 px-6 bg-slate-950/60 border border-slate-800 rounded-2xl max-w-md mx-auto">
            <p className="text-base font-bold text-indigo-300">
              {certData.courseName}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Grade Honor: {certData.grade}
            </p>
          </div>

          {/* Verification Details & QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto text-xs text-slate-400 border-t border-slate-800/80 pt-6 items-center">
            <div className="text-left space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Instructor
              </p>
              <p className="font-bold text-slate-200">{certData.instructorName}</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold mt-2">
                Issue Date
              </p>
              <p className="font-bold text-slate-200">
                {new Date(certData.issueDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-3 bg-slate-950 border border-slate-800 rounded-2xl">
              <img
                src={qrCodeUrl}
                alt="Verification QR Code"
                className="w-20 h-20 rounded-lg border border-slate-700 p-1 bg-white"
              />
              <span className="text-[9px] text-slate-400 mt-1 font-mono">
                Scan to Verify
              </span>
            </div>

            {/* Social Sharing Actions */}
            <div className="text-right space-y-2">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">
                Share Credential
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleShareLinkedIn}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Linkedin size={12} /> LinkedIn
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Twitter size={12} /> X / Twitter
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Kodemates LMS Institutional Credential Registry</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 size={12} /> Valid & Tamper-Proof
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCertificateVerifyPage;
