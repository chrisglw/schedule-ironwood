import { useEffect, useState } from "react";
import { database } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

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

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div className="dashboard-container">
      <h1>Manager Dashboard</h1>

      <h2>Submitted Schedules</h2>
      {schedules.length > 0 ? (
        <ul>
          {schedules.map((schedule) => (
            <li key={schedule.id}>
              <strong>{schedule.name}</strong>:
              {Object.entries(schedule.schedule || {}).map(([day, times]) => (
                <p key={day}>
                  <strong>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day - 1]}:
                  </strong>{" "}
                  {times[0] || "N/A"} - {times[1] || "N/A"}
                </p>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p>No schedules submitted yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
