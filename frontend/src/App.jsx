import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import "./App.css";


function App() {

  const [form, setForm] = useState({

    age: "21–23",
    gender: "Male",
    status: "Student",

    sleep_hours: "6–7 hours",
    sleep_quality: 3,
    screen_time: "2–4 hours",
    exercise: "2–3 days per week",
    social: "Sometimes",
    study_work: "4–6 hours",

    academic_pressure: 3,
    too_much_work: "Sometimes",
    concentration: "Sometimes",

    nervous: "Sometimes",
    overwhelmed: "Sometimes",
    mentally_tired: "Sometimes",
    difficulty_relaxing: "Sometimes",
    unable_to_cope: "Sometimes",

    financial_stress: 3,
    personal_responsibilities: "Sometimes"
  });


  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);


  // ========================================================
  // HANDLE INPUT
  // ========================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setForm({
      ...form,
      [name]:
        [
          "sleep_quality",
          "academic_pressure",
          "financial_stress"
        ].includes(name)
          ? Number(value)
          : value
    });
  };


  // ========================================================
  // SUBMIT
  // ========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);


    try {

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(form)
        }
      );


      const data = await response.json();

      setResult(data);

    }

    catch (error) {

      alert(
        "Backend connection failed. "
        + "Make sure FastAPI is running."
      );

    }

    finally {

      setLoading(false);
    }
  };


  // ========================================================
  // PROBABILITY DATA
  // ========================================================

  const probabilityData = result
    ? Object.entries(
        result.probabilities
      ).map(
        ([name, value]) => ({
          name,
          value
        })
      )
    : [];


  // ========================================================
  // FACTOR DATA
  // ========================================================

  const factorData = result
    ? result.factors.map(
        (factor, index) => ({
          name:
            factor.length > 18
              ? factor.substring(0, 18) + "..."
              : factor,

          value:
            result.factors.length - index
        })
      )
    : [];


  // ========================================================
  // RISK CLASS
  // ========================================================

  const riskClass =
    result?.risk?.toLowerCase();


  return (

    <div className="app">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header className="header">

        <div>

          <p className="tag">
            MACHINE LEARNING SYSTEM
          </p>

          <h1>
            Mental Health
            <span> Risk Prediction</span>
          </h1>

          <p className="subtitle">
            Predict stress risk and receive
            personalized wellbeing insights.
          </p>

        </div>

        <div className="brain">
          🧠
        </div>

      </header>


      {/* ================================================== */}
      {/* FORM */}
      {/* ================================================== */}

      <form
        className="card"
        onSubmit={handleSubmit}
      >

        <h2>
          👤 Respondent Information
        </h2>


        <div className="grid">

          <Field
            label="Age Group"
            name="age"
            value={form.age}
            onChange={handleChange}
            options={[
              "Under 18",
              "18–20",
              "21–23",
              "24–26",
              "27–30",
              "Above 30"
            ]}
          />


          <Field
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={[
              "Male",
              "Female",
              "Other",
              "Prefer not to say"
            ]}
          />


          <Field
            label="Current Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              "Student",
              "Employed",
              "Student and employed",
              "Self-employed",
              "Other"
            ]}
          />

        </div>


        {/* ================================================= */}
        {/* LIFESTYLE */}
        {/* ================================================= */}

        <h2>
          😴 Sleep & Lifestyle
        </h2>


        <div className="grid">

          <Field
            label="Sleep Hours"
            name="sleep_hours"
            value={form.sleep_hours}
            onChange={handleChange}
            options={[
              "Less than 4 hours",
              "4–5 hours",
              "6–7 hours",
              "8–9 hours",
              "More than 9 hours"
            ]}
          />


          <NumberField
            label="Sleep Quality"
            name="sleep_quality"
            value={form.sleep_quality}
            onChange={handleChange}
          />


          <Field
            label="Daily Screen Time"
            name="screen_time"
            value={form.screen_time}
            onChange={handleChange}
            options={[
              "Less than 2 hours",
              "2–4 hours",
              "4–6 hours",
              "6–8 hours",
              "More than 8 hours"
            ]}
          />


          <Field
            label="Physical Activity"
            name="exercise"
            value={form.exercise}
            onChange={handleChange}
            options={[
              "Never",
              "1 day per week",
              "2–3 days per week",
              "4–5 days per week",
              "6–7 days per week"
            ]}
          />


          <Field
            label="Socializing"
            name="social"
            value={form.social}
            onChange={handleChange}
            options={[
              "Never",
              "Rarely",
              "Sometimes",
              "Often",
              "Very often"
            ]}
          />


          <Field
            label="Daily Study / Work"
            name="study_work"
            value={form.study_work}
            onChange={handleChange}
            options={[
              "Less than 2 hours",
              "2–4 hours",
              "4–6 hours",
              "6–8 hours",
              "More than 8 hours"
            ]}
          />

        </div>


        {/* ================================================= */}
        {/* PRESSURE */}
        {/* ================================================= */}

        <h2>
          📚 Study / Work Pressure
        </h2>


        <div className="grid">

          <NumberField
            label="Academic / Work Pressure"
            name="academic_pressure"
            value={form.academic_pressure}
            onChange={handleChange}
          />


          <Field
            label="Too Much Work"
            name="too_much_work"
            value={form.too_much_work}
            onChange={handleChange}
            options={[
              "Never",
              "Rarely",
              "Sometimes",
              "Often",
              "Very often"
            ]}
          />


          <Field
            label="Difficulty Concentrating"
            name="concentration"
            value={form.concentration}
            onChange={handleChange}
            options={[
              "Never",
              "Rarely",
              "Sometimes",
              "Often",
              "Very often"
            ]}
          />

        </div>


        {/* ================================================= */}
        {/* EMOTIONAL */}
        {/* ================================================= */}

        <h2>
          🧠 Mental & Emotional Experiences
        </h2>


        <div className="grid">

          <FrequencyField
            label="Nervous / Worried"
            name="nervous"
            value={form.nervous}
            onChange={handleChange}
          />


          <FrequencyField
            label="Feeling Overwhelmed"
            name="overwhelmed"
            value={form.overwhelmed}
            onChange={handleChange}
          />


          <FrequencyField
            label="Mental / Emotional Tiredness"
            name="mentally_tired"
            value={form.mentally_tired}
            onChange={handleChange}
          />


          <FrequencyField
            label="Difficulty Relaxing"
            name="difficulty_relaxing"
            value={form.difficulty_relaxing}
            onChange={handleChange}
          />


          <FrequencyField
            label="Difficulty Coping"
            name="unable_to_cope"
            value={form.unable_to_cope}
            onChange={handleChange}
          />


          <FrequencyField
            label="Personal Responsibilities"
            name="personal_responsibilities"
            value={form.personal_responsibilities}
            onChange={handleChange}
          />


          <NumberField
            label="Financial Stress"
            name="financial_stress"
            value={form.financial_stress}
            onChange={handleChange}
          />

        </div>


        <button
          className="predict-button"
          disabled={loading}
        >

          {loading
            ? "Analysing..."
            : "🔍 Predict & Analyse"
          }

        </button>

      </form>


      {/* ================================================== */}
      {/* RESULTS */}
      {/* ================================================== */}

      {result && (

        <section className="results">


          {/* ================================================= */}
          {/* RISK */}
          {/* ================================================= */}

          <div
            className={`risk-card ${riskClass}`}
          >

            <div>

              <p>
                PREDICTED STRESS RISK
              </p>

              <h2>
                {result.risk}
              </h2>

            </div>

            <div className="risk-icon">

              {result.risk === "High"
                ? "🔴"
                : result.risk === "Moderate"
                ? "🟡"
                : "🟢"
              }

            </div>

          </div>


          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="summary-grid">

            <Metric
              title="Lifestyle Score"
              value={
                result.lifestyle_score
              }
            />

            <Metric
              title="Pressure Score"
              value={
                result.pressure_score
              }
            />

            <Metric
              title="Attention Areas"
              value={
                result.factors.length
              }
            />

          </div>


          {/* ================================================= */}
          {/* CHARTS */}
          {/* ================================================= */}

          <div className="chart-grid">


            <div className="chart-card">

              <h3>
                📊 Risk Probability
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={probabilityData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>


            <div className="chart-card">

              <h3>
                ⚠️ Main Risk Factors
              </h3>

              {result.factors.length === 0 ? (

                <p className="good">
                  No major risk factors identified.
                </p>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={factorData}
                    layout="vertical"
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      type="number"
                    />

                    <YAxis
                      dataKey="name"
                      type="category"
                      width={130}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#ef4444"
                      radius={[0, 8, 8, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>


          {/* ================================================= */}
          {/* FACTORS */}
          {/* ================================================= */}

          <div className="card">

            <h2>
              ⚠️ Areas Requiring Attention
            </h2>

            {result.factors.length === 0 ? (

              <p>
                No major individual risk factors
                were identified.
              </p>

            ) : (

              <div className="factor-list">

                {result.factors.map(
                  (factor, index) => (

                    <div
                      className="factor"
                      key={index}
                    >

                      ⚠️ {factor}

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* ================================================= */}
          {/* RECOMMENDATIONS */}
          {/* ================================================= */}

          <div className="recommendation-card">

            <h2>
              🎯 Personalized Recommendations
            </h2>

            {result.recommendations.length === 0 ? (

              <p>
                Continue maintaining your current
                healthy daily habits.
              </p>

            ) : (

              result.recommendations.map(
                (recommendation, index) => (

                  <div
                    className="recommendation"
                    key={index}
                  >

                    <span>
                      ✓
                    </span>

                    {recommendation}

                  </div>

                )
              )

            )}

          </div>


          {/* ================================================= */}
          {/* DISCLAIMER */}
          {/* ================================================= */}

          <div className="disclaimer">

            ⚠️ This system is for academic purposes.
            The prediction and recommendations are
            general wellbeing guidance and are not
            a medical diagnosis.

          </div>

        </section>

      )}

    </div>
  );
}


// ============================================================
// FIELD COMPONENT
// ============================================================

function Field({
  label,
  name,
  value,
  onChange,
  options
}) {

  return (

    <div className="field">

      <label>
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
      >

        {options.map(
          option => (

            <option
              key={option}
              value={option}
            >
              {option}
            </option>

          )
        )}

      </select>

    </div>
  );
}


// ============================================================
// FREQUENCY FIELD
// ============================================================

function FrequencyField(
  props
) {

  return (

    <Field
      {...props}
      options={[
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Very often"
      ]}
    />

  );
}


// ============================================================
// NUMBER FIELD
// ============================================================

function NumberField({
  label,
  name,
  value,
  onChange
}) {

  return (

    <div className="field">

      <label>
        {label}
      </label>

      <input
        type="number"
        name={name}
        min="1"
        max="5"
        value={value}
        onChange={onChange}
      />

    </div>

  );
}


// ============================================================
// METRIC
// ============================================================

function Metric({
  title,
  value
}) {

  return (

    <div className="metric">

      <span>
        {title}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}


export default App;