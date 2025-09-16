// Full App.jsx implementation goes here (with HUD, hotkeys, toasts)
import { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Splash from "./Splash";
import Status from "./Status";
import Home from "./Home";
import { APP_VERSION } from "./version";

function AppWithShortcut() {
  const navigate = useNavigate();
  const [showVersionOverlay, setShowVersionOverlay] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [backendStatus, setBackendStatus] = useState("⏳ Checking...");
  const [lastChecked, setLastChecked] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [bannerColor, setBannerColor] = useState("bg-yellow-500");

  const checkBackend = useCallback(() => {
    setLoadingCheck(true);
    fetch("http://localhost:8000/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setBackendStatus(`🟢 Online (uptime: ${Math.floor(data.uptime_seconds / 60)}m)`);
          setBannerColor("bg-green-500");
          toast.success("✅ Backend Online");
          setTimeout(() => setBannerColor("bg-yellow-500"), 1000);
        } else {
          setBackendStatus("🔴 Offline");
          setBannerColor("bg-red-500");
          toast.error("❌ Backend Offline");
          setTimeout(() => setBannerColor("bg-yellow-500"), 1000);
        }
      })
      .catch(() => {
        setBackendStatus("🔴 Offline");
        setBannerColor("bg-red-500");
        toast.error("❌ Backend Offline");
        setTimeout(() => setBannerColor("bg-yellow-500"), 1000);
      })
      .finally(() => {
        setLoadingCheck(false);
        setLastChecked(new Date().toLocaleTimeString());
      });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        setDevMode(true);
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            toast.success("🔍 Opening Developer Status Page...");
            navigate("/status");
            break;
          case "l":
            e.preventDefault();
            localStorage.clear();
            toast.success("🗑️ Local storage cleared, reloading...");
            setTimeout(() => window.location.reload(), 1000);
            break;
          case "v":
            e.preventDefault();
            setShowVersionOverlay(true);
            toast("ℹ️ Showing version info");
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  useEffect(() => {
    let interval;
    if (devMode) {
      checkBackend();
      interval = setInterval(checkBackend, 10000);
    }
    return () => clearInterval(interval);
  }, [devMode, checkBackend]);

  return (
    <>
      {devMode && (
        <div className={`fixed top-0 left-0 right-0 ${bannerColor} transition-colors duration-500 text-black text-sm py-1 z-50 flex justify-between items-center px-4`}>
          <span>
            ⚡ DEV MODE | v{APP_VERSION} | Backend: {backendStatus}
            {lastChecked && <span className="ml-2 text-gray-800 text-xs">(last checked: {lastChecked})</span>}
          </span>
          <div className="flex items-center gap-3">
            <button onClick={checkBackend} disabled={loadingCheck} className="text-xs bg-white px-2 py-0.5 rounded hover:bg-gray-200 disabled:opacity-50">
              {loadingCheck ? "..." : "🔄"}
            </button>
            <button onClick={() => setDevMode(false)} className="text-xs underline hover:text-red-700">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/status" element={<Status />} />
      </Routes>
      <Toaster position="bottom-center" />

      {showVersionOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-xl font-bold mb-2">Halobot</h2>
            <p className="text-gray-700">Version: v{APP_VERSION}</p>
            <button onClick={() => setShowVersionOverlay(false)} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWithShortcut />
    </Router>
  );
}
