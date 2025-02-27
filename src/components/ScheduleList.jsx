import { useEffect, useState } from "react";
import { database } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../styles/ScheduleList.css";

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");
  const [weeks, setWeeks] = useState([]);

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

  return (
    <div className="schedule-list-container">
      <h2>Submitted Schedules</h2>

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

      {/* Display Schedules */}
      {filteredSchedules.length === 0 ? (
        <p>No schedules submitted for this week.</p>
      ) : (
        filteredSchedules.map((entry) => (
          <div key={entry.id} className="schedule-entry">
            <h3>{entry.name}</h3>
            {Object.entries(entry.schedule || {}).map(([day, times]) => (
              <p key={day}>
                <strong>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day - 1]}:
                </strong>{" "}
                {times[0] || "N/A"} - {times[1] || "N/A"}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduleList;