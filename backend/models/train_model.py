import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib
import os

def create_and_train():
    # 1. Create a synthetic dataset for FD Recommendation
    data = {
        "amount": [10000, 50000, 200000, 600000, 100000, 1500000, 5000, 750000, 20000, 1000000],
        "duration_months": [6, 12, 24, 60, 6, 36, 12, 60, 3, 24],
        "risk_level": [0, 0, 1, 2, 1, 2, 0, 1, 0, 2], # 0: low, 1: medium, 2: high
        "age": [30, 65, 45, 35, 25, 40, 20, 62, 55, 50],
        "recommendation": [
            "Short-Term Flexi FD",
            "Senior Citizen FD",
            "Standard Bank FD",
            "Corporate FD",
            "Short-Term Flexi FD",
            "Corporate FD",
            "SBI / Post Office FD",
            "Senior Citizen FD",
            "Short-Term Flexi FD",
            "Small Finance Bank FD"
        ]
    }
    
    df = pd.DataFrame(data)
    
    # Save dataset to CSV for reference
    os.makedirs(os.path.dirname(__file__), exist_ok=True)
    df.to_csv(os.path.join(os.path.dirname(__file__), 'dataset.csv'), index=False)
    
    X = df[['amount', 'duration_months', 'risk_level', 'age']]
    y = df['recommendation']
    
    # 2. Train Decision Tree
    clf = DecisionTreeClassifier(random_state=42, max_depth=5)
    clf.fit(X, y)
    
    # 3. Save Model
    model_path = os.path.join(os.path.dirname(__file__), 'fd_model.pkl')
    joblib.dump(clf, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    create_and_train()
