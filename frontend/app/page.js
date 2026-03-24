"use client";

import { useState } from "react";
import axios from "axios";

const CONDITIONS = [  "Infection","Hypertension","Depression","Diabetes",  "Pain Relief"];
const DRUG_SUGGESTIONS = ["Ciprofloxacin","Metoprolol","Bupropion","Glipizide","Paracetamol","Escitalopram",
  "Metformin","Amlodipine","Ibuprofen","Tramadol","Azithromycin","Sertraline","Insulin Glargine","Losartan",
  "Amoxicillin"];

function getRiskLevel(risk) {
  if (risk < 35) return { label: "Low Risk", color: "#0F6E56", bg: "#E1F5EE", bar: "#1D9E75" };
  if (risk < 65) return { label: "Moderate", color: "#854F0B", bg: "#FAEEDA", bar: "#EF9F27" };
  return { label: "High Risk", color: "#A32D2D", bg: "#FCEBEB", bar: "#E24B4A" };
}

function RiskBar({ value }) {
  const { bar } = getRiskLevel(value);
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888780", fontFamily: "'DM Sans', sans-serif" }}>Risk Score</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: bar, fontFamily: "'DM Mono', monospace" }}>{value}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "#F1EFE8", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: bar, borderRadius: 99, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
    </div>
  );
}

function StatPill({ label, value, unit }) {
  return (
    <div style={{ background: "#F1EFE8", borderRadius: 8, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888780", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 700, color: "#2C2C2A", fontFamily: "'DM Mono', monospace", lineHeight: 1.1 }}>
        {value}<span style={{ fontSize: 11, fontWeight: 400, color: "#888780", marginLeft: 2 }}>{unit}</span>
      </span>
    </div>
  );
}

export default function DigitalTwin() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [drugInput, setDrugInput] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState([]);

  const [form, setForm] = useState({
    age: "",
    gender: "Male",
    weight: "",
    condition: "",
    dosage: "",
    duration: "",
  });

  const [results, setResults] = useState([]);
  const [bestDrug, setBestDrug] = useState(null);
  const [patientId] = useState(Math.floor(Math.random() * 9000) + 1000);

  const addDrug = (drug) => {
    const d = drug.trim();
    if (d && !selectedDrugs.includes(d)) setSelectedDrugs([...selectedDrugs, d]);
    setDrugInput("");
  };

  const removeDrug = (drug) => setSelectedDrugs(selectedDrugs.filter(d => d !== drug));

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/simulate", {
        age: parseInt(form.age),
        gender: form.gender,
        condition: form.condition,
        dosage: parseInt(form.dosage),
        duration: parseInt(form.duration),
        drugs: selectedDrugs,
      });
      const data = res.data.results;
      setResults(data);
      const best = data.reduce((min, curr) =>
        curr.risk_percentage < min.risk_percentage ? curr : min
      );
      setBestDrug(best);
      setStep(3);
    } catch {
      alert("Backend error — make sure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF9F7", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Fraunces:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select { font-family: 'DM Sans', sans-serif; }
        ::placeholder { color: #B4B2A9; }
        input:focus, select:focus { outline: 2px solid #185FA5; outline-offset: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom: "1px solid #E8E6DF", background: "#FFFFFF", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#185FA5", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white" /></svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#2C2C2A", fontFamily: "'Fraunces', serif", letterSpacing: "-0.01em" }}>DigitalTwin</span>
          <span style={{ fontSize: 11, background: "#E6F1FB", color: "#185FA5", padding: "2px 8px", borderRadius: 99, fontWeight: 500, letterSpacing: "0.04em" }}>BETA</span>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#888780" }}>
          <span style={{ color: "#185FA5", fontWeight: 500, cursor: "pointer" }}>Simulate</span>
          <span style={{ cursor: "pointer" }}>History</span>
          <span style={{ cursor: "pointer" }}>Reports</span>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>DR</div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888780", marginBottom: 8, fontWeight: 500 }}>Treatment Simulation Engine</p>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: "#2C2C2A", fontFamily: "'Fraunces', serif", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Patient Digital Twin
          </h1>
          <p style={{ fontSize: 15, color: "#5F5E5A", marginTop: 8, maxWidth: 520, lineHeight: 1.6 }}>
            Build a virtual patient profile, compare treatment protocols, and receive AI-powered outcome predictions before clinical administration.
          </p>
        </div>

        {/* PROGRESS */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40, background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: 12, padding: "12px 20px" }}>
          {[{ n: 1, label: "Patient Profile" }, { n: 2, label: "Treatment Setup" }, { n: 3, label: "Simulation Results" }].map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: s.n <= step ? "pointer" : "default" }}
                onClick={() => { if (s.n < step) setStep(s.n); }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: step >= s.n ? "#185FA5" : "#F1EFE8",
                  color: step >= s.n ? "white" : "#888780",
                  fontSize: 12, fontWeight: 600, flexShrink: 0, transition: "all 0.2s"
                }}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span style={{ fontSize: 13, fontWeight: step === s.n ? 600 : 400, color: step >= s.n ? "#2C2C2A" : "#B4B2A9", whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > s.n ? "#185FA5" : "#E8E6DF", margin: "0 16px", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: 16, padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2C2C2A", fontFamily: "'Fraunces', serif", marginBottom: 6 }}>Patient Information</h2>
              <p style={{ fontSize: 13, color: "#888780", marginBottom: 28 }}>Enter the patient's demographic and clinical baseline data.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#5F5E5A", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>Age</label>
                  <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                    placeholder="e.g. 58" type="number"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #D3D1C7", borderRadius: 8, fontSize: 14, color: "#2C2C2A", background: "#FAFAF8" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#5F5E5A", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>Biological Sex</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #D3D1C7", borderRadius: 8, fontSize: 14, color: "#2C2C2A", background: "#FAFAF8" }}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#5F5E5A", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>Primary Diagnosis</label>
                  <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #D3D1C7", borderRadius: 8, fontSize: 14, color: "#2C2C2A", background: "#FAFAF8" }}>
                    <option value="">Select condition</option>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={() => { if (form.age && form.condition) setStep(2); }}
                disabled={!form.age || !form.condition}
                style={{
                  marginTop: 32, padding: "12px 28px",
                  background: form.age && form.condition ? "#185FA5" : "#D3D1C7",
                  color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: form.age && form.condition ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s"
                }}>
                Continue to Treatment Setup
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#E6F1FB", border: "1px solid #B5D4F4", borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#185FA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>How it works</p>
                <ol style={{ paddingLeft: 16, color: "#0C447C", fontSize: 13, lineHeight: 1.8 }}>
                  <li>Build the patient's digital profile</li>
                  <li>Select treatment candidates</li>
                  <li>AI predicts outcomes per drug</li>
                  <li>Get a ranked recommendation</li>
                </ol>
              </div>
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#5F5E5A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Powered by</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["MIMIC-III Clinical Dataset", "XGBoost Survival Model", "Random Forest LOS Predictor", "Drug Interaction Scorer"].map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5F5E5A" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", flexShrink: 0 }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: 16, padding: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#2C2C2A", fontFamily: "'Fraunces', serif", marginBottom: 6 }}>Treatment Protocol</h2>
              <p style={{ fontSize: 13, color: "#888780", marginBottom: 28 }}>Configure dosage parameters and add candidate drugs to compare.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#5F5E5A", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>Dosage (mg)</label>
                  <input value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })}
                    placeholder="e.g. 500" type="number"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #D3D1C7", borderRadius: 8, fontSize: 14, color: "#2C2C2A", background: "#FAFAF8" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#5F5E5A", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>Duration (days)</label>
                  <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 14" type="number"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #D3D1C7", borderRadius: 8, fontSize: 14, color: "#2C2C2A", background: "#FAFAF8" }} />
                </div>
              </div>

              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#5F5E5A", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>Candidate Drugs</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <input value={drugInput} onChange={e => setDrugInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addDrug(drugInput); }}
                  placeholder="Type drug name and press Enter"
                  style={{ flex: 1, padding: "10px 14px", border: "1px solid #D3D1C7", borderRadius: 8, fontSize: 14, color: "#2C2C2A", background: "#FAFAF8" }} />
                <button onClick={() => addDrug(drugInput)}
                  style={{ padding: "10px 18px", background: "#2C2C2A", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Add
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                {DRUG_SUGGESTIONS.map(d => (
                  <button key={d} onClick={() => addDrug(d)} disabled={selectedDrugs.includes(d)}
                    style={{ padding: "4px 12px", borderRadius: 99, border: "1px solid #D3D1C7", fontSize: 12, background: selectedDrugs.includes(d) ? "#F1EFE8" : "#FAFAF8", color: selectedDrugs.includes(d) ? "#B4B2A9" : "#5F5E5A", cursor: selectedDrugs.includes(d) ? "not-allowed" : "pointer" }}>
                    + {d}
                  </button>
                ))}
              </div>

              {selectedDrugs.length > 0 && (
                <div style={{ background: "#F1EFE8", borderRadius: 10, padding: 16, marginBottom: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#888780", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Selected ({selectedDrugs.length})</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedDrugs.map(d => (
                      <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, background: "#FFFFFF", border: "1px solid #D3D1C7", borderRadius: 6, padding: "5px 10px" }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A" }}>{d}</span>
                        <button onClick={() => removeDrug(d)} style={{ background: "none", border: "none", cursor: "pointer", color: "#B4B2A9", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setStep(1)}
                  style={{ padding: "12px 20px", background: "transparent", color: "#5F5E5A", border: "1px solid #D3D1C7", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  ← Back
                </button>
                <button onClick={handleSimulate}
                  disabled={selectedDrugs.length < 2 || loading || !form.dosage || !form.duration}
                  style={{
                    flex: 1, padding: "12px 28px",
                    background: selectedDrugs.length >= 2 && !loading && form.dosage && form.duration ? "#185FA5" : "#D3D1C7",
                    color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: selectedDrugs.length >= 2 && !loading && form.dosage && form.duration ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                  }}>
                  {loading ? (
                    <>
                      <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                      Running Simulation...
                    </>
                  ) : "Run AI Simulation →"}
                </button>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E8E6DF", borderRadius: 16, padding: 24, height: "fit-content" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#888780", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Patient Summary</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #F1EFE8" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#185FA5" }}>
                  {form.gender === "Female" ? "F" : "M"}
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#2C2C2A" }}>Patient #{patientId}</p>
                  <p style={{ fontSize: 12, color: "#888780" }}>{form.condition}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <StatPill label="Age" value={form.age} unit="yrs" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && results.length > 0 && (
          <div>
            {bestDrug && (
              <div style={{ background: "#E1F5EE", border: "1px solid #9FE1CB", borderRadius: 16, padding: "24px 28px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F6E56", marginBottom: 4 }}>AI Recommendation</p>
                  <h2 style={{ fontSize: 26, fontWeight: 900, color: "#085041", fontFamily: "'Fraunces', serif", letterSpacing: "-0.01em" }}>{bestDrug.drug}</h2>
                  <p style={{ fontSize: 14, color: "#0F6E56", marginTop: 4 }}>Optimal treatment — lowest risk profile across all simulations</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888780", marginBottom: 2 }}>Risk Score</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: "#0F6E56", fontFamily: "'DM Mono', monospace" }}>{bestDrug.risk_percentage}%</p>
                  </div>
                  <div style={{ background: "#FFFFFF", borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888780", marginBottom: 2 }}>Side Effect</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#085041" }}>{bestDrug.predicted_side_effect || "Minimal"}</p>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#2C2C2A", marginBottom: 4 }}>Treatment Comparison</h3>
              <p style={{ fontSize: 13, color: "#888780" }}>All {results.length} candidate drugs ranked by risk score</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
              {results
                .sort((a, b) => a.risk_percentage - b.risk_percentage)
                .map((r, i) => {
                  const { label, color, bg } = getRiskLevel(r.risk_percentage);
                  const isBest = bestDrug && r.drug === bestDrug.drug;
                  return (
                    <div key={i} style={{
                      background: "#FFFFFF",
                      border: isBest ? "2px solid #1D9E75" : "1px solid #E8E6DF",
                      borderRadius: 14, padding: 20, position: "relative"
                    }}>
                      {isBest && (
                        <div style={{ position: "absolute", top: -1, right: 16, background: "#1D9E75", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 6px 6px", letterSpacing: "0.06em" }}>
                          BEST MATCH
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#888780", marginBottom: 2 }}>Rank #{i + 1}</div>
                          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2C2C2A", fontFamily: "'Fraunces', serif" }}>{r.drug}</h3>
                        </div>
                        <span style={{ background: bg, color: color, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, letterSpacing: "0.04em" }}>{label}</span>
                      </div>
                      <div style={{ background: "#F1EFE8", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                        <p style={{ fontSize: 11, color: "#888780", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Predicted Side Effect</p>
                        <p style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>{r.predicted_side_effect || "None reported"}</p>
                      </div>
                      <RiskBar value={r.risk_percentage} />
                      {r.improvement_score !== undefined && (
                        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888780" }}>
                          <span>Improvement Score</span>
                          <span style={{ fontWeight: 600, color: "#185FA5", fontFamily: "'DM Mono', monospace" }}>{r.improvement_score}/100</span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid #E8E6DF" }}>
              <button onClick={() => { setStep(1); setResults([]); setBestDrug(null); setSelectedDrugs([]); setForm({ age: "", gender: "Male", weight: "", condition: "", dosage: "", duration: "" }); }}
                style={{ padding: "11px 22px", background: "transparent", color: "#5F5E5A", border: "1px solid #D3D1C7", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                New Simulation
              </button>
              <button onClick={() => setStep(2)}
                style={{ padding: "11px 22px", background: "transparent", color: "#185FA5", border: "1px solid #B5D4F4", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                Adjust Parameters
              </button>
              <button style={{ padding: "11px 22px", background: "#2C2C2A", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Export PDF Report
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}