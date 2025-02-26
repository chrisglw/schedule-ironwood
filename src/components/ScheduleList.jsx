import { useEffect, useState } from "react";
import { database } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore";

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "schedule"));
        const scheduleData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchedules(scheduleData);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div>
      <h2>Submitted Schedules</h2>
      {schedules.length === 0 ? (
        <p>No schedules submitted yet.</p>
      ) : (
        schedules.map((entry) => (
          <div key={entry.id}>
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
