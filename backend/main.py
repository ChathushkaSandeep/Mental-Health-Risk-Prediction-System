from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="Mental Health Risk Prediction API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODEL
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "mental_health_stress_model.pkl"
)

model = joblib.load(MODEL_PATH)


# ============================================================
# MAPPINGS
# ============================================================

frequency_mapping = {
    "Never": 0,
    "Rarely": 1,
    "Sometimes": 2,
    "Often": 3,
    "Very often": 4
}


sleep_mapping = {
    "Less than 4 hours": 0,
    "4–5 hours": 1,
    "6–7 hours": 2,
    "8–9 hours": 3,
    "More than 9 hours": 4
}


screen_mapping = {
    "Less than 2 hours": 0,
    "2–4 hours": 1,
    "4–6 hours": 2,
    "6–8 hours": 3,
    "More than 8 hours": 4
}


exercise_mapping = {
    "Never": 0,
    "1 day per week": 1,
    "2–3 days per week": 2,
    "4–5 days per week": 3,
    "6–7 days per week": 4
}


study_mapping = {
    "Less than 2 hours": 0,
    "2–4 hours": 1,
    "4–6 hours": 2,
    "6–8 hours": 3,
    "More than 8 hours": 4
}


# ============================================================
# REQUEST MODEL
# ============================================================

class SurveyData(BaseModel):

    age: str
    gender: str
    status: str

    sleep_hours: str
    sleep_quality: int
    screen_time: str
    exercise: str
    social: str
    study_work: str

    academic_pressure: int
    too_much_work: str
    concentration: str

    nervous: str
    overwhelmed: str
    mentally_tired: str
    difficulty_relaxing: str
    unable_to_cope: str

    financial_stress: int
    personal_responsibilities: str


# ============================================================
# RECOMMENDATIONS
# ============================================================

def generate_recommendations(data):

    recommendations = []
    factors = []


    sleep = sleep_mapping[data.sleep_hours]
    screen = screen_mapping[data.screen_time]
    exercise = exercise_mapping[data.exercise]
    social = frequency_mapping[data.social]

    workload = frequency_mapping[data.too_much_work]
    concentration = frequency_mapping[data.concentration]

    nervous = frequency_mapping[data.nervous]
    overwhelmed = frequency_mapping[data.overwhelmed]
    tired = frequency_mapping[data.mentally_tired]
    relaxing = frequency_mapping[data.difficulty_relaxing]
    coping = frequency_mapping[data.unable_to_cope]

    personal = frequency_mapping[
        data.personal_responsibilities
    ]


    # Sleep
    if sleep <= 1:
        factors.append("Low sleep duration")
        recommendations.append(
            "Improve your sleep duration and maintain "
            "a consistent sleep routine."
        )

    if data.sleep_quality <= 2:
        factors.append("Poor sleep quality")
        recommendations.append(
            "Try to improve sleep quality by maintaining "
            "a consistent bedtime routine."
        )


    # Screen
    if screen >= 3:
        factors.append("High screen time")
        recommendations.append(
            "Reduce unnecessary screen time, especially "
            "during rest periods and before bedtime."
        )


    # Exercise
    if exercise <= 1:
        factors.append("Low physical activity")
        recommendations.append(
            "Consider adding regular physical activity "
            "such as walking or another activity you enjoy."
        )


    # Social
    if social <= 1:
        factors.append("Low social interaction")
        recommendations.append(
            "Spend more time with supportive friends, "
            "family members, or trusted people."
        )


    # Academic pressure
    if data.academic_pressure >= 4:
        factors.append("High academic/work pressure")
        recommendations.append(
            "Break large tasks into smaller manageable "
            "tasks and prioritize important work."
        )


    # Workload
    if workload >= 3:
        factors.append("High workload")
        recommendations.append(
            "Organize your workload into smaller steps "
            "and take regular breaks."
        )


    # Concentration
    if concentration >= 3:
        factors.append("Concentration difficulty")
        recommendations.append(
            "Try shorter focused study/work sessions "
            "with regular breaks."
        )


    # Nervous
    if nervous >= 3:
        factors.append("Frequent nervousness/worry")
        recommendations.append(
            "Consider relaxation activities such as "
            "slow breathing, walking, or short breaks."
        )


    # Overwhelmed
    if overwhelmed >= 3:
        factors.append("Feeling overwhelmed")
        recommendations.append(
            "Prioritize important tasks and discuss "
            "workload difficulties with someone you trust."
        )


    # Tired
    if tired >= 3:
        factors.append("Mental/emotional tiredness")
        recommendations.append(
            "Make time for adequate rest and recovery."
        )


    # Relaxing
    if relaxing >= 3:
        factors.append("Difficulty relaxing")
        recommendations.append(
            "Include regular relaxation periods in your routine."
        )


    # Coping
    if coping >= 3:
        factors.append("Difficulty coping")
        recommendations.append(
            "Consider reaching out to a trusted person "
            "or appropriate support service."
        )


    # Financial
    if data.financial_stress >= 4:
        factors.append("High financial stress")
        recommendations.append(
            "Consider discussing financial concerns with "
            "a trusted person or appropriate support service."
        )


    # Personal responsibilities
    if personal >= 3:
        factors.append(
            "Personal responsibilities affecting study/work"
        )

        recommendations.append(
            "Consider reorganizing responsibilities "
            "and discussing them with trusted people."
        )


    return factors, recommendations


# ============================================================
# PREDICT ENDPOINT
# ============================================================

@app.post("/predict")
def predict(data: SurveyData):

    sleep = sleep_mapping[data.sleep_hours]
    screen = screen_mapping[data.screen_time]
    exercise = exercise_mapping[data.exercise]
    social = frequency_mapping[data.social]

    study = study_mapping[data.study_work]

    workload = frequency_mapping[data.too_much_work]
    concentration = frequency_mapping[data.concentration]

    nervous = frequency_mapping[data.nervous]
    overwhelmed = frequency_mapping[data.overwhelmed]
    tired = frequency_mapping[data.mentally_tired]
    relaxing = frequency_mapping[data.difficulty_relaxing]
    coping = frequency_mapping[data.unable_to_cope]

    personal = frequency_mapping[
        data.personal_responsibilities
    ]


    # ========================================================
    # FEATURE ENGINEERING
    # ========================================================

    lifestyle_score = (
        (data.sleep_quality / 5)
        + (exercise / 4)
        + (social / 4)
        - (screen / 4)
    )


    pressure_score = (
        (data.academic_pressure / 5)
        + (workload / 4)
        + (data.financial_stress / 5)
        + (personal / 4)
    )


    # ========================================================
    # MODEL DATA
    # ========================================================

    new_data = pd.DataFrame([{

        "2. What is your age group?":
            data.age,

        "3. What is your gender?":
            data.gender,

        "4. What is your current main status?":
            data.status,

        "5. On average, how many hours do you sleep per night?":
            sleep,

        "6. How would you rate your sleep quality?":
            data.sleep_quality,

        "7. Approximately how many hours per day do you spend on screens outside essential study/work?":
            screen,

        "8. How often do you engage in physical activity or exercise?":
            exercise,

        "9. How often do you spend time socializing with friends, family, or others?":
            social,

        "10. Approximately how many hours per day do you spend studying or working?":
            study,

        "11. How would you rate your current academic/work pressure?":
            data.academic_pressure,

        "12. How often do you feel that you have too much studying/work to manage?":
            workload,

        "13. How often do you have difficulty concentrating on your studies/work?":
            concentration,

        "14. How often have you felt nervous or worried recently?":
            nervous,

        "15. How often have you felt overwhelmed by your responsibilities?":
            overwhelmed,

        "16. How often have you felt mentally or emotionally tired?":
            tired,

        "17. How often have you had difficulty relaxing?":
            relaxing,

        "18. How often have you felt unable to cope with the things you needed to do?":
            coping,

        "19. How would you rate your current financial stress?":
            data.financial_stress,

        "20. How often do personal responsibilities interfere with your studies/work?":
            personal,

        "Lifestyle_Score":
            lifestyle_score,

        "Pressure_Score":
            pressure_score
    }])


    # ========================================================
    # PREDICTION
    # ========================================================

    prediction = model.predict(new_data)

    risk = str(prediction[0])


    # ========================================================
    # PROBABILITY
    # ========================================================

    probabilities = {}

    if hasattr(model, "predict_proba"):

        probs = model.predict_proba(
            new_data
        )[0]

        for label, probability in zip(
            model.classes_,
            probs
        ):

            probabilities[str(label)] = round(
                float(probability * 100),
                2
            )


    # ========================================================
    # RECOMMENDATIONS
    # ========================================================

    factors, recommendations = generate_recommendations(
        data
    )


    # ========================================================
    # RETURN
    # ========================================================

    return {

        "risk": risk,

        "probabilities": probabilities,

        "lifestyle_score": round(
            lifestyle_score,
            2
        ),

        "pressure_score": round(
            pressure_score,
            2
        ),

        "factors": factors,

        "recommendations": recommendations
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Mental Health Risk Prediction API is running"
    }