
import { User, RefreshCcw, Sun, Moon, Trash2, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../slices/authSlice";
import { logout } from "../../slices/authSlice";
import { fetchProfile, setProfileUser } from "../../slices/profileSlice";
import { useNavigate } from "react-router-dom";


import axios from 'axios'; // Assuming you use axios for API calls
// ==========================
// PROFILE FORM COMPONENT (FIXED)
// ==========================
const ProfileForm = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imgVersion, setImgVersion] = useState(Date.now());
  const dispatch = useDispatch();

  // Accessing profile and token from Redux store

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (user?.profilePicture) {
      setImgVersion(Date.now());
    }
  }, [user?.profilePicture]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewSource(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!imageFile) {
    toast.error("Please select an image");
    return;
  }

  setIsSaving(true);

  try {
    const formData = new FormData();
    formData.append("displayPicture", imageFile);

    const response = await axios.put(`http://localhost:5000/api/profiles/updateDisplayPicture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      // Update both slices so dashboard and navbar re-render from fresh data
      const updatedUser = response.data.updatedUser || response.data.user || response.data;
      dispatch(setAuthUser(updatedUser));
      dispatch(setProfileUser(updatedUser));
      toast.success("Profile picture updated!");
      // Ensure server RTT is reflected (keeps both slices in sync again)
      dispatch(fetchProfile());
      setImageFile(null);
      setPreviewSource(null);
    } else {
      toast.error("Upload failed");
    }
  } catch (error) {
    console.error(error);
    toast.error("Upload failed");
  } finally {
    setIsSaving(false);
  }
};

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-200 border-2 border-blue-500 shadow-md">
          {previewSource ? (
            <img
              src={previewSource}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : user?.profilePicture ? (
            <img
              src={`${user.profilePicture}?t=${imgVersion}`}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              No image uploaded yet
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-slate-500 
          file:mr-4 file:py-2 file:px-4 
          file:rounded-full file:border-0 
          file:text-sm file:font-semibold 
          file:bg-blue-50 file:text-blue-700 
          hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          {isSaving ? "Uploading..." : "Update Profile Picture"}
        </button>
      </div>

    </form>
  );
};


const ResetTokenForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(`http://localhost:5000/api/users/resetPasswordToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.success ? "✅ Reset link sent to your email!" : "❌ " + (data.message || "Failed."));
    } catch (error) {
      setMessage("❌ Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">We will send a secure reset link to your registered email.</p>
      <form onSubmit={handleResetRequest} className="flex flex-col md:flex-row gap-3">
        <input 
          type="email" required placeholder="email@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500" 
        />
        <button disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50">
          {isLoading ? "Sending..." : "Send Link"}
        </button>
      </form>
      {message && <p className="text-sm font-medium animate-in fade-in slide-in-from-top-1">{message}</p>}
    </div>
  );
};

// ==========================================
// 2. MAIN SETTINGS PAGE
// ==========================================

export default function Settings() {
  const [openSection, setOpenSection] = useState("profile");
  const [theme, setTheme] = useState("light");
  const [islogin, setIslogin] = useState(true);
 const dispatch = useDispatch();
 const navigate = useNavigate();


  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

const token = useSelector((state) => state.auth.token);
  const email = useSelector((state) => state.auth.user?.email);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
const [confirmText, setConfirmText] = useState("");

const handleDeleteAccount = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/users/deleteAccount`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.success("Account deleted successfully!");

      // clear everything
      localStorage.clear();

      // reset redux
      dispatch(logout());

      // redirect
      navigate("/login", { replace: true });

    } else {
      toast.error(data.message || "Failed to delete account");
    }

  } catch (error) {
    console.error("Error deleting account:", error.message);
  }
};

  
  const sections = [
    { id: "profile", label: "Update Profile", icon: <User size={20} />, color: "text-blue-500", component: <ProfileForm /> },
    { id: "reset", label: "Reset Password", icon: <RefreshCcw size={20} />, color: "text-purple-500", component: <ResetTokenForm /> },
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-black p-4 md:p-10 text-slate-900 dark:text-slate-100">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account preferences and security.</p>
        </header>

        <div className="space-y-4">
          {/* Dynamic Sections */}
          {sections.map((section) => (
            <div key={section.id} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${openSection === section.id ? "bg-slate-50 dark:bg-slate-800/50" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`${section.color}`}>{section.icon}</span>
                  <span className="font-semibold text-lg">{section.label}</span>
                </div>
                <ChevronDown className={`transition-transform duration-300 ${openSection === section.id ? "rotate-180" : ""}`} />
              </button>

              <div className={`transition-all duration-300 ease-in-out ${openSection === section.id ? "max-h-[500px] opacity-100 p-6 border-t border-slate-100 dark:border-slate-800" : "max-h-0 opacity-0 overflow-hidden"}`}>
                {section.component}
              </div>
            </div>
          ))}

          {/* Theme Section (Non-Form) */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-yellow-500">{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}</span>
                <div>
                  <p className="font-semibold text-lg">Theme Settings</p>
                  <p className="text-sm text-slate-500">Turn  {theme} mode</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 dark:bg-blue-600 transition-colors"
              >
                <span className={`${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'} inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform`} />
              </button>
            </div>
          </div>
<button
  onClick={() => setShowDeletePopup(true)}
  className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md"
>
  Delete My Account
</button>


{showDeletePopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">

    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-7 border border-gray-200 dark:border-gray-800">

      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-lg">
          <Trash2 className="text-red-600" size={22} />
        </div>

        <h3 className="text-lg font-bold text-red-600">
          Danger Zone
        </h3>
      </div>

      {/* Warning Text */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
        Deleting your account is permanent and cannot be undone.
        All your data, courses, and history will be permanently removed.
      </p>

      {/* Confirm Input */}
      <div className="mb-5">
        <label className="text-xs text-gray-500 font-medium">
          Type <span className="text-red-500 font-semibold">DELETE</span> to confirm
        </label>

        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          className="mt-1 w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-gray-800"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">

        <button
          onClick={() => setShowDeletePopup(false)}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={confirmText !== "DELETE"}
          className={`px-4 py-2 text-sm rounded-lg font-semibold text-white transition ${
            confirmText === "DELETE"
              ? "bg-red-600 hover:bg-red-700 shadow-md"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Delete Account
        </button>

      </div>
    </div>
  </div>
)}


        </div>
      </div>
    </div>
  );
} 