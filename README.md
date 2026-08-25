# Mental Health Risk Prediction using Machine Learning

## Project Overview

This project develops a machine learning system for predicting mental health stress risk using lifestyle, academic/work, and personal factors.

The system uses survey data collected through a Google Form and applies machine learning techniques to predict stress risk levels.

## Technologies Used

- Python
- Pandas
- NumPy
- Scikit-learn
- Jupyter Notebook
- FastAPI
- React
- Vite
- Recharts
- Joblib

## Machine Learning Model

The project evaluates multiple classification models and selects the best-performing model based on the evaluation results.

The trained model is saved using Joblib and used by the backend API for predictions.

## Features

- Survey-based prediction
- Stress risk classification
- Risk probability
- Lifestyle score
- Pressure score
- Risk factor analysis
- Personalized recommendations
- Data visualizations

## System Architecture

Google Form
↓
Survey Dataset
↓
Data Preprocessing
↓
Feature Engineering
↓
Machine Learning Model
↓
Saved Joblib Model
↓
FastAPI Backend
↓
React Frontend
↓
Prediction and Recommendations

## Running the Backend

Create and activate the Python virtual environment.

Install dependencies:

```bash
pip install fastapi uvicorn pandas numpy scikit-learn joblib