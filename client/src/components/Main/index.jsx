import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const Main = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    rollNo: "",
    course: "js",
  });

  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const fetchSubmittedData = async () => {
    try {
      const authToken = localStorage.getItem("token");
      console.log("Token sent in request:", authToken);

      const response = await axios.get("http://localhost:5713/api/tutor/getSubmittedData", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("API Response Data:", response.data);

      if (Array.isArray(response.data)) {
        setSubmittedData(response.data);
      } else {
        console.error("Invalid data format received:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem("token");
      console.log("Token sent in request:", authToken);

      const response = await axios.post("http://localhost:5713/api/tutor/getTutorId", { token: authToken });

      const tutorId = response.data.tutorId;

      const submitResponse = await axios.post("http://localhost:5713/api/tutor/submitStudentData", {
        tutorId,
        name: studentData.name,
        rollNo: studentData.rollNo,
        course: studentData.course,
      });

      console.log("Submit Response:", submitResponse.data);

      fetchSubmittedData();

      setStudentData({
        name: "",
        rollNo: "",
        course: "js",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>Teacher  Portal</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className={styles.form_container}>
        <form onSubmit={handleSubmit}>
          <label>
            Student Name:
            <input
              type="text"
              name="name"
              value={studentData.name}
              onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
            />
          </label>
          <br />

          <label>
            Roll Number:
            <input
              type="text"
              name="rollNo"
              value={studentData.rollNo}
              onChange={(e) => setStudentData({ ...studentData, rollNo: e.target.value })}
            />
          </label>
          <br />

          <label>
            Course:
            <select
              name="course"
              value={studentData.course}
              onChange={(e) => setStudentData({ ...studentData, course: e.target.value })}
            >
              <option value="js">JavaScript</option>
              <option value="node">Node.js</option>
              <option value="node">React.js</option>
              <option value="node">HTML</option>
              <option value="node">CSS</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <br />

          <button type="submit" >Submit</button>
        </form>
      </div>

      <div className={styles.table_container}>
        <h2 style={{textAlign: "center"}}>Submitted Data</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data) => (
              <tr key={data._id}>
                <td>{data.name}</td>
                <td>{data.rollNo}</td>
                <td>{data.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Main;
