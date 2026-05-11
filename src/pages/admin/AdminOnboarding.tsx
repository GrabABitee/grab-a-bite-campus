import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function AdminOnboarding() {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState<any[]>([]);
  const [collegeId, setCollegeId] = useState("");
  const [cafName, setCafName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD COLLEGES ================= */
  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      const data = await api.getColleges();
      setColleges(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load colleges");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!collegeId || !cafName) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      /* 1. CREATE CAFETERIA */
      const cafeteria = await api.createCafeteria({
        name: cafName,
        location,
        isOpen: true,
        collegeId,
      });

      /* 2. ASSIGN CAFETERIA TO USER */
      await api.updateCurrentUser({
        cafeteria: {
          cafeteriaId: cafeteria.cafeteria_id, // ✅ FIXED
        },
      });

      /* 3. REDIRECT */
      navigate("/admin"); // ✅ FIXED

    } catch (err) {
      console.error(err);
      alert("Failed to setup cafeteria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">

      <div className="bg-white p-6 rounded-xl w-[400px] shadow space-y-4">

        <h2 className="text-xl font-bold">Setup Cafeteria</h2>

        {/* ================= COLLEGE SELECT ================= */}
        <select
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select College</option>
          {colleges.map((c) => (
            <option key={c.college_id} value={c.college_id}>
              {c.college_name}
            </option>
          ))}
        </select>

        {/* ================= CAF NAME ================= */}
        <input
          placeholder="Cafeteria Name"
          value={cafName}
          onChange={(e) => setCafName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* ================= LOCATION ================= */}
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* ================= BUTTON ================= */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Create Cafeteria"}
        </button>

      </div>
    </div>
  );
}