import { useEffect, useState } from "react";
import { database } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [weeks, setWeeks] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  // Function to get the current week in ISO format (e.g., "2023-W44")
  const getCurrentWeek = () => {
    const date = new Date();
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "schedule"));
        const scheduleData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchedules(scheduleData);

        // Extract unique weeks from schedules and sort in descending order
        const uniqueWeeks = [...new Set(scheduleData.map((s) => s.week))].sort(
          (a, b) => b.localeCompare(a)
        );
        setWeeks(uniqueWeeks);

        // Set the default week to the current week
        const currentWeek = getCurrentWeek();
        setSelectedWeek(currentWeek);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  // Filter schedules by the selected week
  const filteredSchedules = schedules.filter(
    (schedule) => schedule.week === selectedWeek
  );

  // Update schedule status
  const handleStatusChange = async (id, status) => {
    try {
      await updateDoc(doc(database, "schedule", id), { status });
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div className="dashboard-container">
      <h1>Manager Dashboard</h1>

      {/* Week Selector */}
      <div>
        <label htmlFor="week-select">Select Week: </label>
        <select
          id="week-select"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        >
          {weeks.map((week) => (
            <option key={week} value={week}>
              {week}
            </option>
          ))}
        </select>
      </div>

      <h2>Submitted Schedules</h2>
      {filteredSchedules.length > 0 ? (
        <ul>
          {filteredSchedules.map((schedule) => (
            <li
              key={schedule.id}
              className={`schedule-item ${schedule.status.toLowerCase().replace(" ", "-")}`}
            >
              <strong>{schedule.name}</strong>
              <p>Type: {schedule.scheduleType}</p>
              <p>Starts on: {schedule.customDates || "N/A"}</p>
              <p>Submitted: {new Date(schedule.submissionDate).toLocaleString()}</p>
              {Object.entries(schedule.schedule || {}).map(([day, times]) => (
                <p key={day}>
                  <strong>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day - 1]}:
                  </strong>{" "}
                  {times[0] || "N/A"} - {times[1] || "N/A"}
                </p>
              ))}
              <div className="status-dropdown">
                <label>Status: </label>
                <select
                  value={schedule.status}
                  onChange={(e) => handleStatusChange(schedule.id, e.target.value)}
                >
                  <option value="Entered">Entered</option>
                  <option value="Not Entered">Not Entered</option>
                  <option value="Invalid">Invalid</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No schedules submitted for this week.</p>
      )}
    </div>
  );
};

export default Dashboard;