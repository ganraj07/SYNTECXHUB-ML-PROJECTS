# ==========================================
# HOUSE PRICE PREDICTION USING LINEAR REGRESSION
# ==========================================

# Step 1: Import Libraries

import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# ==========================================
# Step 2: Load Dataset
# ==========================================

df = pd.read_csv('/content/housing.csv')

print("Dataset Shape:", df.shape)
print("\nFirst 5 Rows:")
print(df.head())

# ==========================================
# Step 3: Explore Dataset
# ==========================================

print("\nDataset Information:")
print(df.info())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nStatistical Summary:")
print(df.describe())

# ==========================================
# Step 4: Data Cleaning
# ==========================================

# Fill missing values in total_bedrooms
df['total_bedrooms'].fillna(df['total_bedrooms'].median(), inplace=True)

# ==========================================
# Step 5: Handle Categorical Feature
# ==========================================

# Convert ocean_proximity into numerical columns
df = pd.get_dummies(df, columns=['ocean_proximity'], drop_first=True)

print("\nDataset After Encoding:")
print(df.head())

# ==========================================
# Step 6: Define Features and Target
# ==========================================

X = df.drop('median_house_value', axis=1)
y = df['median_house_value']

# ==========================================
# Step 7: Train-Test Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining Shape:", X_train.shape)
print("Testing Shape:", X_test.shape)

# ==========================================
# Step 8: Train Linear Regression Model
# ==========================================

model = LinearRegression()

model.fit(X_train, y_train)

# ==========================================
# Step 9: Prediction
# ==========================================

y_pred = model.predict(X_test)

# ==========================================
# Step 10: Evaluate Model
# ==========================================

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("\nModel Performance")
print("-------------------")
print("RMSE :", rmse)
print("R² Score :", r2) 

# ==========================================
# Histogram
# ==========================================

X_train.hist(figsize=(15,10))

# ==========================================
# correlation heatmap
# ==========================================

import matplotlib.pyplot as plt
import seaborn as sns
plt.figure(figsize=(15,10))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')

# ==========================================
# Scatter Plot (Actual price vs Predicted price)
# ==========================================

results_df = pd.DataFrame({'Actual Price': y_test, 'Predicted Price': y_pred})
plt.figure(figsize=(15,10))
sns.scatterplot(data=results_df, x='Actual Price', y='Predicted Price', hue='Actual Price')

# ==========================================
# Step 11: Interpret Coefficients
# ==========================================

coefficients = pd.DataFrame({
    'Feature': X.columns,
    'Coefficient': model.coef_
})

coefficients = coefficients.sort_values(
    by='Coefficient',
    ascending=False
)

print("\nFeature Coefficients:")
print(coefficients)

# ==========================================
# Step 12: Save Model
# ==========================================

joblib.dump(model, 'house_price_model.pkl')

print("\nModel Saved Successfully!")

# ==========================================
# Step 13: Load Saved Model
# ==========================================

loaded_model = joblib.load('house_price_model.pkl')

print("Model Loaded Successfully!")

# ==========================================
# Step 14: Example Predictions
# ==========================================

print("\nSample Predictions")

sample_predictions = loaded_model.predict(X_test.iloc[:5])

for i in range(5):
    print(f"Actual Price    : {y_test.iloc[i]}")
    print(f"Predicted Price : {sample_predictions[i]:.2f}")
    print("-"*40)