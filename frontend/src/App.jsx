import { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
    personal_responsibilities: "Sometimes",
  });


  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  
  // Backend connection polling
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      try {
        const res = await fetch("http://127.0.0.1:8000/", {
          method: "GET",
          signal: controller.signal,
        });
        clearTimeout(timer);
        setIsBackendConnected(res.ok);
      } catch {
        setIsBackendConnected(false);
      }
    };
    checkBackend();
    const id = setInterval(checkBackend, 5000);
    return () => clearInterval(id);
  }, []);



  
  // HANDLE INPUT

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,

      [name]:
        [
          "sleep_quality",
          "academic_pressure",
          "financial_stress",
        ].includes(name)
          ? Number(value)
          : value,
    });
  };



  
  // SUBMIT

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );


      if (!response.ok) {
        throw new Error("Prediction request failed");
      }


      const data = await response.json();

      setResult(data);

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);

    }

    catch (error) {

      alert(
        "Backend connection failed.\n\n" +
        "Please make sure FastAPI is running:\n" +
        "uvicorn backend.main:app --reload"
      );

    }

    finally {

      setLoading(false);

    }
  };


 
  
  // CHART DATA

  const probabilityData = result
    ? Object.entries(result.probabilities).map(
      ([name, value]) => ({
        name,
        value,
      })
    )
    : [];


  const factorData = result
    ? result.factors.map(
      (factor, index) => ({
        name:
          factor.length > 20
            ? factor.substring(0, 20) + "..."
            : factor,

        value:
          result.factors.length - index,
      })
    )
    : [];




  // RISK CLASS

  const riskClass =
    result?.risk?.toLowerCase() || "";



  // RENDER

  return (

    <div className="app-shell">



      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            🧠
          </div>

          <div>

            <strong>
              Mental Health
            </strong>

            <span>
              ML Prediction
            </span>

          </div>

        </div>


        <nav className="sidebar-nav">

          <a
            href="#dashboard"
            className="nav-item active"
          >
            <span>⌂</span>
            Dashboard
          </a>


          <a
            href="#assessment"
            className="nav-item"
          >
            <span>✓</span>
            Risk Assessment
          </a>


          <a
            href="#analysis"
            className="nav-item"
          >
            <span>▥</span>
            Analysis
          </a>


          <a
            href="#recommendations"
            className="nav-item"
          >
            <span>♡</span>
            Recommendations
          </a>


          <a
            href="#about"
            className="nav-item"
          >
            <span>ⓘ</span>
            About
          </a>

        </nav>


        <div className="sidebar-bottom">

          <div className="connection-card">

            <div className={`status-dot ${isBackendConnected ? "" : "offline-dot-status"}`}></div>

            <div>

              <strong>
                {isBackendConnected ? "Backend Connected" : "Backend Offline"}
              </strong>

              <small>
                {isBackendConnected ? "FastAPI prediction service" : "Start uvicorn to connect"}
              </small>

            </div>

          </div>


          <div className="sidebar-tip">

            <span>💡</span>

            <p>
              Complete the assessment to
              receive a personalized
              stress-risk prediction.
            </p>

          </div>

        </div>

      </aside>




      {/* MAIN */}

      <main className="main-content">


        {/* TOP BAR */}

        <div className="topbar">

          <div>

            <p className="eyebrow">
              MACHINE LEARNING SYSTEM
            </p>

            <h1>
              Mental Health Risk Prediction
            </h1>

            <p className="page-description">
              Assess stress risk using lifestyle,
              academic/work and wellbeing factors.
            </p>

          </div>


          <div className="top-status">

            <span className={`online-dot ${isBackendConnected ? "" : "offline-dot-status"}`}></span>

            {isBackendConnected ? "System Ready" : "System Offline"}

          </div>

        </div>




        {/* DASHBOARD */}

        <section
          id="dashboard"
          className="dashboard-section"
        >

          <div className="section-heading">

            <div>

              <h2>
                Assessment Overview
              </h2>

              <p>
                Current assessment and prediction summary.
              </p>

            </div>

          </div>


          <div className="overview-grid">


            <div className="overview-card primary-card">

              <div className="overview-icon">
                🧠
              </div>

              <div>

                <span>
                  PREDICTION MODEL
                </span>

                <strong>
                  Logistic Regression
                </strong>

                <small>
                  Best performing model
                </small>

              </div>

            </div>


            <div className="overview-card">

              <div className="overview-icon soft">
                🌿
              </div>

              <div>

                <span>
                  ASSESSMENT TYPE
                </span>

                <strong>
                  Lifestyle & Wellbeing
                </strong>

                <small>
                  Survey-based prediction
                </small>

              </div>

            </div>


            <div className="overview-card">

              <div className="overview-icon soft">
                📊
              </div>

              <div>

                <span>
                  OUTPUT
                </span>

                <strong>
                  Stress Risk Level
                </strong>

                <small>
                  Low / Moderate / High
                </small>

              </div>

            </div>


          </div>

        </section>




        {/* ASSESSMENT */}

        <section
          id="assessment"
          className="assessment-section"
        >

          <form
            className="assessment-card"
            onSubmit={handleSubmit}
          >


            <div className="card-heading">

              <div className="heading-icon">
                👤
              </div>

              <div>

                <h2>
                  Risk Assessment
                </h2>

                <p>
                  Enter the respondent's information
                  and wellbeing-related answers.
                </p>

              </div>

            </div>



            {/* RESPONDENT */}

            <div className="form-section">

              <div className="form-section-title">
                <span>01</span>
                Respondent Information
              </div>


              <div className="form-grid">

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
                    "Above 30",
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
                    "Prefer not to say",
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
                    "Other",
                  ]}
                />

              </div>

            </div>



            {/* LIFESTYLE */}

            <div className="form-section">

              <div className="form-section-title">
                <span>02</span>
                Sleep & Lifestyle
              </div>


              <div className="form-grid">

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
                    "More than 9 hours",
                  ]}
                />


                <NumberField
                  label="Sleep Quality (1–5)"
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
                    "More than 8 hours",
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
                    "6–7 days per week",
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
                    "Very often",
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
                    "More than 8 hours",
                  ]}
                />

              </div>

            </div>



            {/* PRESSURE */}

            <div className="form-section">

              <div className="form-section-title">
                <span>03</span>
                Academic / Work Pressure
              </div>


              <div className="form-grid">

                <NumberField
                  label="Academic / Work Pressure (1–5)"
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
                    "Very often",
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
                    "Very often",
                  ]}
                />

              </div>

            </div>



            {/* EMOTIONAL */}

            <div className="form-section">

              <div className="form-section-title">
                <span>04</span>
                Mental & Emotional Experiences
              </div>


              <div className="form-grid">

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
                  label="Financial Stress (1–5)"
                  name="financial_stress"
                  value={form.financial_stress}
                  onChange={handleChange}
                />

              </div>

            </div>



            {/* BUTTON */}

            <div className="submit-area">

              <div>

                <strong>
                  Ready to assess?
                </strong>

                <span>
                  Your answers are processed by
                  the trained ML model.
                </span>

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

            </div>


          </form>

        </section>




        {/* RESULTS */}

        {result && (

          <section
            id="analysis"
            className="results"
          >


            {/* RISK RESULT */}

            <div
              className={`risk-result ${riskClass}`}
            >

              <div className="risk-result-content">

                <span className="result-label">
                  PREDICTED STRESS RISK
                </span>

                <h2>
                  {result.risk}
                </h2>

                <p>
                  Based on the submitted lifestyle,
                  pressure and wellbeing responses.
                </p>

              </div>


              <div className="risk-badge">

                {result.risk === "High"
                  ? "🔴"
                  : result.risk === "Moderate"
                    ? "🟡"
                    : "🟢"
                }

              </div>

            </div>



            {/* METRICS */}

            <div className="metric-grid">

              <Metric
                title="Lifestyle Score"
                value={result.lifestyle_score}
                icon="🌿"
              />


              <Metric
                title="Pressure Score"
                value={result.pressure_score}
                icon="📚"
              />


              <Metric
                title="Attention Areas"
                value={result.factors.length}
                icon="⚠️"
              />

            </div>



            {/* CHARTS */}

            <div className="charts-grid">


              <div className="chart-card">

                <div className="chart-heading">

                  <div>

                    <h3>
                      Risk Probability
                    </h3>

                    <p>
                      Model confidence across risk categories
                    </p>

                  </div>

                  <span>
                    📊
                  </span>

                </div>


                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={probabilityData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8e5"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fill: "#52666a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tick={{
                        fill: "#52666a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#2A7F7F"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>



              <div className="chart-card">

                <div className="chart-heading">

                  <div>

                    <h3>
                      Main Risk Factors
                    </h3>

                    <p>
                      Areas requiring attention
                    </p>

                  </div>

                  <span>
                    ⚠️
                  </span>

                </div>


                {result.factors.length === 0 ? (

                  <div className="good-message">

                    <span>✓</span>

                    No major individual risk
                    factors were identified.

                  </div>

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
                        stroke="#e2e8e5"
                      />

                      <XAxis
                        type="number"
                      />

                      <YAxis
                        dataKey="name"
                        type="category"
                        width={140}
                        tick={{
                          fill: "#52666a",
                          fontSize: 11,
                        }}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        fill="#D95C5C"
                        radius={[0, 8, 8, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                )}

              </div>

            </div>



            {/* FACTORS */}

            <div className="insight-card">

              <div className="insight-heading">

                <div className="insight-icon warning">
                  ⚠️
                </div>

                <div>

                  <h2>
                    Areas Requiring Attention
                  </h2>

                  <p>
                    Factors identified from the user's
                    submitted responses.
                  </p>

                </div>

              </div>


              {result.factors.length === 0 ? (

                <div className="good-message">

                  <span>✓</span>

                  No major individual risk
                  factors were identified.

                </div>

              ) : (

                <div className="factor-list">

                  {result.factors.map(
                    (factor, index) => (

                      <div
                        className="factor"
                        key={index}
                      >

                        <span>
                          {index + 1}
                        </span>

                        {factor}

                      </div>

                    )
                  )}

                </div>

              )}

            </div>



            {/* RECOMMENDATIONS */}

            <div
              id="recommendations"
              className="recommendation-card"
            >

              <div className="insight-heading">

                <div className="insight-icon green">
                  🌿
                </div>

                <div>

                  <h2>
                    Personalized Recommendations
                  </h2>

                  <p>
                    Suggestions generated according to
                    the assessment results.
                  </p>

                </div>

              </div>


              {result.recommendations.length === 0 ? (

                <div className="good-message">

                  <span>✓</span>

                  Continue maintaining your current
                  healthy daily habits.

                </div>

              ) : (

                <div className="recommendation-list">

                  {result.recommendations.map(
                    (recommendation, index) => (

                      <div
                        className="recommendation"
                        key={index}
                      >

                        <div className="recommendation-number">
                          {index + 1}
                        </div>

                        <p>
                          {recommendation}
                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>



            {/* DISCLAIMER */}

            <div className="disclaimer">

              <strong>
                Academic project notice:
              </strong>

              {" "}
              This system is developed for academic
              purposes. Predictions and recommendations
              provide general wellbeing guidance and
              are not a medical diagnosis.

            </div>


          </section>

        )}




        {/* ABOUT */}

        <section
          id="about"
          className="about-card"
        >

          <div>

            <span className="eyebrow">
              ABOUT THE SYSTEM
            </span>

            <h2>
              Machine Learning for Wellbeing
            </h2>

            <p>
              This system uses survey-based lifestyle,
              academic/work and wellbeing information
              to estimate a user's stress risk level.
              The prediction is generated using the
              trained machine learning model through
              the FastAPI backend.
            </p>

          </div>

          <div className="about-points">

            <span>
              ✓ Data preprocessing
            </span>

            <span>
              ✓ Feature engineering
            </span>

            <span>
              ✓ Machine learning prediction
            </span>

            <span>
              ✓ Result analysis
            </span>

          </div>

        </section>



        <footer>
          Mental Health Risk Prediction • Machine Learning Coursework
        </footer>


      </main>

    </div>
  );
}




// FIELD

function Field({
  label,
  name,
  value,
  onChange,
  options,
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
          (option) => (

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




// FREQUENCY FIELD

function FrequencyField(props) {

  return (

    <Field
      {...props}
      options={[
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Very often",
      ]}
    />

  );
}




// NUMBER FIELD

function NumberField({
  label,
  name,
  value,
  onChange,
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




// METRIC

function Metric({
  title,
  value,
  icon,
}) {

  return (

    <div className="metric-card">

      <div className="metric-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


export default App;