import { useState } from "react";
import { database } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "../styles/ScheduleForm.css";

const ScheduleForm = () => {
  const [name, setName] = useState("");
  const [scheduleType, setScheduleType] = useState("permanent"); // "permanent" or "temporary"
  const [customDates, setCustomDates] = useState("");
  const [schedule, setSchedule] = useState({
    1: { 0: "", 1: "" },
    2: { 0: "", 1: "" },
    3: { 0: "", 1: "" },
    4: { 0: "", 1: "" },
    5: { 0: "", 1: "" },
    6: { 0: "", 1: "" },
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Function to get the current week in ISO format (e.g., "2023-W44")
  const getCurrentWeek = () => {
    const date = new Date();
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
  };

  const handleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      // Add the current week, schedule type, custom dates, and submission timestamp
      const week = getCurrentWeek();
      const submissionDate = new Date().toISOString(); // Current date and time
      await addDoc(collection(database, "schedule"), {
        name,
        schedule,
        week,
        scheduleType,
        customDates,
        submissionDate,
        status: "Not Entered", // Default status for manager tracking
      });
      setName("");
      setSchedule({
        1: { 0: "", 1: "" },
        2: { 0: "", 1: "" },
        3: { 0: "", 1: "" },
        4: { 0: "", 1: "" },
        5: { 0: "", 1: "" },
        6: { 0: "", 1: "" },
      });
      setCustomDates("");
      alert("Schedule submitted!");
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  return (
    <div className="schedule-form-container">
      <h2>Submit Your Schedule</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Schedule Inputs */}
        {Object.keys(schedule).map((dayIndex) => (
          <div key={dayIndex} className="day-container">
            <label>{daysOfWeek[dayIndex - 1]}</label>
            <div className="time-inputs">
              <input
                type="time"
                value={schedule[dayIndex][0]}
                onChange={(e) => handleChange(dayIndex, 0, e.target.value)}
              />{" "}
              to{" "}
              <input
                type="time"
                value={schedule[dayIndex][1]}
                onChange={(e) => handleChange(dayIndex, 1, e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* Schedule Type Dropdown */}
        <div className="form-group">
          <label>Schedule Type:</label>
          <select
            value={scheduleType}
            onChange={(e) => setScheduleType(e.target.value)}
          >
            <option value="permanent">Permanent</option>
            <option value="temporary">Temporary</option>
          </select>
        </div>

        {/* Custom Dates Input */}
        <div className="form-group">
          <p>The schedule will take place the following week, unless specified.</p>
          <input
            type="text"
            placeholder="Enter the start date for this schedule"
            value={customDates}
            onChange={(e) => setCustomDates(e.target.value)}
          />
        </div>

        <button type="submit">Submit Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleForm;