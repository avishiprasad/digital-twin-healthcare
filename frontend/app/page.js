"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    condition: "",
    dosage: "",
    duration: "",
    drugs: ""
  });

  const [results, setResults] = useState([]);
  const [bestDrug, setBestDrug] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/simulate", {
        age: parseInt(form.age),
        gender: form.gender,
        condition: form.condition,
        dosage: parseInt(form.dosage),
        duration: parseInt(form.duration),
        drugs: form.drugs.split(",").map(d => d.trim())
      });

      const data = response.data.results;
      setResults(data);

      // Find best drug (lowest risk)
      if (data.length > 0) {
        const best = data.reduce((min, curr) =>
          curr.risk_percentage < min.risk_percentage ? curr : min
        );
        setBestDrug(best);
      }

    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        🧠 Digital Twin Patient Simulator
      </h1>

      {/* FORM */}
      <div style={{ marginTop: "20px" }}>
        <input name="age" placeholder="Age" onChange={handleChange} /><br /><br />
        <input name="gender" placeholder="Gender (Male/Female)" onChange={handleChange} /><br /><br />
        <input name="condition" placeholder="Condition" onChange={handleChange} /><br /><br />
        <input name="dosage" placeholder="Dosage" onChange={handleChange} /><br /><br />
        <input name="duration" placeholder="Duration" onChange={handleChange} /><br /><br />

        <input 
          name="drugs"
          placeholder="Drugs (comma separated)"
          onChange={handleChange}
        /><br /><br />

        <button 
          onClick={handleSubmit}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🚀 Run Simulation
        </button>
      </div>

      {/* RESULTS */}
      <div style={{ marginTop: "30px" }}>
        <h2>Simulation Results</h2>

        {results.map((r, index) => (
          <div 
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9"
            }}
          >
            <p><b>Drug:</b> {r.drug}</p>
            <p><b>Predicted Side Effect:</b> {r.predicted_side_effect}</p>
            <p><b>Risk:</b> {r.risk_percentage}%</p>
          </div>
        ))}
      </div>

      {/* BEST DRUG */}
      {bestDrug && (
        <div 
          style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "#d4edda",
            borderRadius: "8px"
          }}
        >
          <h3>✅ Recommended Treatment</h3>
          <p>
            <b>{bestDrug.drug}</b> is the safest option with lowest risk (
            {bestDrug.risk_percentage}%)
          </p>
        </div>
      )}

    </div>
  );
}