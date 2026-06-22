# 🏠 House Price Prediction using Linear Regression

A Machine Learning project that predicts house prices using the California Housing Dataset and Linear Regression. This project demonstrates the complete ML pipeline, including data preprocessing, exploratory data analysis (EDA), model training, evaluation, visualization, and model persistence.

## Project Overview

The goal of this project is to predict the median house value based on housing characteristics such as location, income, population, number of rooms, and proximity to the ocean.

The project follows a structured Machine Learning workflow:

- Data Loading
- Data Cleaning
- Exploratory Data Analysis (EDA)
- Feature Engineering
- Train-Test Split
- Linear Regression Model Training
- Model Evaluation
- Visualization
- Model Saving and Loading

---

## Dataset

**Dataset:** California Housing Dataset (`housing.csv`)

### Features

| Feature | Description |
|----------|------------|
| longitude | Longitude of the house block |
| latitude | Latitude of the house block |
| housing_median_age | Median age of houses |
| total_rooms | Total number of rooms |
| total_bedrooms | Total number of bedrooms |
| population | Population in the block |
| households | Number of households |
| median_income | Median income of residents |
| ocean_proximity | Distance from ocean (categorical) |

### Target Variable

- `median_house_value`

---

## Exploratory Data Analysis

The following visualizations were performed:

### Histogram Analysis
Visualizes the distribution of numerical features and helps identify skewness and outliers.

### Correlation Heatmap
Shows relationships among features and helps identify strongly correlated variables.

### Scatter Plot
Compares actual house prices with predicted house prices to evaluate model performance visually.

---

## Data Preprocessing

### Missing Value Handling
Missing values in the `total_bedrooms` column are replaced using the median value.

```python
df['total_bedrooms'].fillna(df['total_bedrooms'].median(), inplace=True)
```

### Categorical Encoding

The categorical feature `ocean_proximity` is converted into numerical form using One-Hot Encoding.

```python
pd.get_dummies()
```

---

## Machine Learning Model

### Algorithm Used

**Linear Regression**

Linear Regression establishes a relationship between independent variables and the target variable to predict house prices.

---

## Model Evaluation

The model performance is measured using:

### RMSE (Root Mean Squared Error)

Measures prediction error.

\[
RMSE = \sqrt{\frac{\sum(y-\hat y)^2}{n}}
\]

### R² Score

Measures how well the model explains the variance in the target variable.

\[
R^2 = 1 - \frac{SS_{res}}{SS_{tot}}
\]

---

## Technologies Used

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Scikit-Learn
- Joblib
- Google Colab

---

## Project Structure

```
House-Price-Prediction/
│
├── housing.csv
├── House_Price_Prediction.ipynb
├── house_price_model.pkl
├── README.md
└── requirements.txt

## Installation

Clone the repository:

```bash
git clone https://github.com/ganraj07/House-Price-Prediction.git
```

Move into the project folder:

```bash
cd House-Price-Prediction
```

Install required libraries:

```bash
pip install pandas numpy matplotlib seaborn scikit-learn joblib
```

---

## Running the Project

Run the notebook in Google Colab or Jupyter Notebook:

```bash
jupyter notebook
```

or upload the notebook directly to Google Colab.

---

## Model Saving

The trained model is saved using Joblib:

```python
joblib.dump(model, 'house_price_model.pkl')
```

Load the saved model:

```python
loaded_model = joblib.load('house_price_model.pkl')
```

---

## Sample Prediction

```python
sample_predictions = loaded_model.predict(X_test.iloc[:5])
```

Example Output:

```
Actual Price    : 47700
Predicted Price : 52012.45

Actual Price    : 458300
Predicted Price : 441874.76
```

---

## Key Learning Outcomes

- Data Cleaning and Preprocessing
- Exploratory Data Analysis (EDA)
- Feature Engineering
- Linear Regression
- Model Evaluation using RMSE and R²
- Data Visualization
- Model Persistence using Joblib

## Project Highlights

✅ Data Cleaning & Preprocessing  
✅ Exploratory Data Analysis (EDA)  
✅ Histogram Visualization  
✅ Correlation Heatmap  
✅ Scatter Plot Analysis  
✅ Linear Regression Model  
✅ RMSE & R² Evaluation  
✅ Feature Coefficient Interpretation  
✅ Model Saving & Loading  
✅ House Price Prediction

---

**#MachineLearning #DataScience #Python #LinearRegression #HousePricePrediction #ScikitLearn #EDA #AI**
